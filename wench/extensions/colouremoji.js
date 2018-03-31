//* TITLE ColourEmoji **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Make emoji's in posts and tags show up coloured for Windows Edge users **//
//* DEVELOPER ArtificialWench **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.ColourEmoji = new Object({
	running: false,
	regex: null,

	run: function() {
		this.running = true;
		XKit.tools.init_css("ColourEmoji");

		XKit.post_listener.add("ColourEmoji", function() { XKit.extensions.ColourEmoji.add_spans(); });
		XKit.interface.post_window_listener.add("ColourEmoji", function() { XKit.extensions.ColourEmoji.add_spans(); });

		XKit.extensions.ColourEmoji.add_spans();
	},

	add_spans: function() {

		function addEmojiTextNodeSpans(root) {
			var ranges = [
				'(?:[\u2139\u2194-\u2199\u21a9-\u21aa\u2300-\u2bff][\ufe00-\ufe0f]?)',
				'(?:\ud83c[\udc00-\udfff][\ufe00-\ufe0f]?)', // U+1F000 to U+1F3FF
				'(?:\ud83d[\udc00-\udfff][\ufe00-\ufe0f]?)', // U+1F400 to U+1F7FF
				'(?:\ud83e[\udc00-\uddff][\ufe00-\ufe0f]?)', // U+1F800 to U+1F9FF
			];
			var regex = new RegExp('((?:' + ranges.join('|') + ')+)', 'g');

			function ignoreElement(elem) {
				if (elem.tagName === "SPAN" && elem.hasAttribute("class")) {
					var classes = elem.getAttribute("class").split(" ");
					if (classes.indexOf("mwext-colour-emojis") != -1 || classes.indexOf("colouremoji") != -1)
						return true;
				}
				if (elem.tagName === "LINK" || elem.tagName === "SCRIPT" || elem.tagName === "HEAD" || elem.getAttribute("contenteditable") === "true")
					return true;
				return false;
			}

			var text_nodes = [];

			function getEmojiTextNodes(node) {
				if (node.nodeType == 3) {
					if (node.nodeValue.search(regex) != -1) {
						text_nodes.push(node);
					}
				} else {
					if (node.nodeType == 1 && ignoreElement(node))
						return;

					for (var i = 0, len = node.childNodes.length; i < len; ++i) {
						getEmojiTextNodes(node.childNodes[i]);
					}
				}
			}

			getEmojiTextNodes(root);

			for (var i = 0; i < text_nodes.length; ++i) {
				var split = text_nodes[i].nodeValue.split(regex);
				var fragment = document.createDocumentFragment();
				for (var sp = 0; sp < split.length; sp++) {
					if (split[sp] !== '') {
						var textnode = document.createTextNode(split[sp]);
						fragment.appendChild(textnode);
					}
					sp++;
					if (sp < split.length) {
						var emojinode = document.createElement("span");
						emojinode.setAttribute("class", "mwext-colour-emojis");
						emojinode.textContent = split[sp];
						fragment.appendChild(emojinode);
					}
				}
				text_nodes[i].parentNode.replaceChild(fragment, text_nodes[i]);
			}
			return text_nodes;
		}

		$(".post").find(".post_content").not(".colouremoji-done").each(function() {
			var $this = $(this);
			$this.addClass("colouremoji-done");

			addEmojiTextNodeSpans(this);
		});
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("ColourEmoji");
		this.regex = null;
		XKit.tools.remove_css("ColourEmoji");
	}
});

