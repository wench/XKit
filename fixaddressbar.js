// look for changes in '.post-form-modal-content' OR '#new_post_buttons' 
// 
// if '.post-form' is destroyed then make sure the stupid url gets set back correctly
if (window.location.pathname.startsWith('/dashboard/')) {
	let original_path = window.location.href;
	let node1 = document.querySelector(".post-forms-modal .post-form-modal-content");
	let node2 = document.querySelector("#new_post_buttons");
	if (node1 || node2) {
    // create an observer instance
		let observer = new MutationObserver(function(mutations) {
			if (window.location.pathname == '/dashboard') {
				history.replaceState({}, document.title, original_path);
			}
		});

    // configuration of the observer:
		let config = { childList: true };

    // pass in the target node, as well as the observer options
		if (node1) observer.observe(node1, config);

		if (node2) observer.observe(node2, config);
	}
}
