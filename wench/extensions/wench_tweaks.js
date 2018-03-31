//* TITLE wench_tweaks **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	**//
//* DEVELOPER ArtificialWench **//
//* FRAME false **//
//* BETA false **//

let regex = /^(.*_)(\d{3,})\.gifv?$/;
let regexv = /^(.*_)(\d{3,})\.gifv\?$/;

XKit.extensions.wench_tweaks = new Object({

  dashfrom_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA30lEQVRIx82VPQ6CQBCFvyWaeANjYuIlrNRErkRhDVzAzs7SytYDiEeww9IzeABshmRilh9hl/CSCbBs5s2bNwswMIqWkbRNOLGsPYBM7kNgD6TqfdxXga4ukbW6PbUIfPfc1qJQVRgqJeM02daiFDASpblGxV/w7kEw9oNmG+PaKUpbFpL9PJsmoq6IJbHx7YE3gmKoKXKmYAbMGxSs+hBc5HO+qFAQAS9g3ZXgDSyBu5BoBRFwBG7As0+/d8AHyIGTkBzkegWmLkzdCok+3c6Sl9goEufJNcm54sc1DL4nvkelbiaSHQAAAABJRU5ErkJggg==",

  running: false,

  run: function () {
    XKit.tools.init_css("wench_tweaks");
    this.running = true;

    let old_local_export = XKit.extensions.xcloud.local_export;
    XKit.extensions.xcloud.local_export = function () {
      if (!window.navigator.msSaveOrOpenBlob) {
        old_local_export();
      }
      else {
        let upload_data = this.create_export_data(false)[0];
        let data_blob = new Blob([upload_data], { type: "text/plain" });

        window.navigator.msSaveBlob(data_blob, "xcloud_payload.txt");

        XKit.extensions.xcloud.hide_overlay();
      }
    };

    XKit.interface.create_control_button("wench-tweaks-dashfrom", this.dashfrom_icon, "Browse Dashboard From", null);
    $(document).on("click", ".wench-tweaks-dashfrom", function (event) {
      window.open('https://tumblr.com/dashboard/20/' + $(this).attr('data-post-id'), '_blank');
    });

    let processposts = () => {
      let posts = XKit.interface.get_posts("wench-tweaks-done");

      $(posts).each(function () {
        $(this).addClass("wench-tweaks-done");
        let m_post = XKit.interface.post($(this));

        XKit.extensions.wench_tweaks.checkgifs($(this), m_post);

        if ($(this).hasClass("is_note") && XKit.interface.where().inbox === true) { return; }

        XKit.interface.add_control_button(this, "wench-tweaks-dashfrom", "");
      });
    };
    XKit.post_listener.add("wench_tweaks", processposts);
    if ($(".posts .post").length > 0) processposts();
  },

  destroy: function () {
    this.running = false;
  },


  checkgifs: function (post, m_post) {
    //    console.dir(post);
    /* Embedded figure in text post
    <figure class="tmblr-full" data-tumblr-attribution="lexa-is-eternal:dj7RmZffCAaw6qIS8iqK4g:ZywGrh2II7Lhj">
      <img src="https://78.media.tumblr.com/d5a7231c3cd3cf050daa4e17b385864d/tumblr_ol6bq3NZzd1v9wrqpo1_500.gif" class="">
      <p class="tmblr-attribution">
        <a href="https://tmblr.co/ZywGrh2II7Lhj" target="_blank" data-peepr="{&quot;tumblelog&quot;:&quot;lexa-is-eternal&quot;,&quot;postId&quot;:&quot;157070220013&quot;}">Originally posted by lexa-is-eternal</a>
      </p>
    </figure>
    */
    $(post).find("figure.tmblr-full:not(.wench-tweaks-gifdone)").each(function () {
      let $this = $(this);
      $this.addClass("wench-tweaks-gifdone");

      let $img = $this.children("img").first();
      let $link = $this.children("p").children("a").first();
      if ($img.length > 0) {

        let blog = undefined, postId = undefined;

        if ($link.length > 0) {
          let data = JSON.parse($link.attr("data-peepr"));
          if (data) {
            blog = data.tumblelog;
            postId = data.postId;
          }
        }
        console.dir($img);
        XKit.extensions.wench_tweaks.lowerimage($img, blog, postId);
      }
    });

    /* Photo sets
    <div id="photoset_168963280024" class="photoset">
      <div class="photoset_row photoset_row_2" style="height:267px; width:540px;">
        <a href="https://78.media.tumblr.com/67b62dd8990f0f4e86c9f5274dc82384/tumblr_p11f0jWvo11qgu742o1_400.gif" class="photoset_photo rapid-noclick-resp" id="photoset_link_168963280024_1" data-enable-lightbox="1" data-photoset-index="1">
          <img class="" style="width:268px;" src="https://78.media.tumblr.com/67b62dd8990f0f4e86c9f5274dc82384/tumblr_p11f0jWvo11qgu742o1_400.gif" alt="" data-pin-url="http://dulciesgf.tumblr.com/post/p11f0jWvo11qgu742o1/dont-do-tippy-toes-again-though" data-pin-description="dulciesgf">
        </a>
        <a href="https://78.media.tumblr.com/f89a61e3604bb63839731382235a82c3/tumblr_p11f0jWvo11qgu742o4_400.gif" class="photoset_photo rapid-noclick-resp" id="photoset_link_168963280024_2" data-enable-lightbox="1" data-photoset-index="2">
          <img class="" style="width:268px;" src="https://78.media.tumblr.com/f89a61e3604bb63839731382235a82c3/tumblr_p11f0jWvo11qgu742o4_400.gif" alt="" data-pin-url="http://dulciesgf.tumblr.com/post/168625598140/dont-do-tippy-toes-again-though" data-pin-description="dulciesgf">
        </a>
      </div>
      <div class="photoset_row photoset_row_2" style="height:267px; width:540px;">
        <a href="https://78.media.tumblr.com/98b32d1a6953436e24edae0d99b14d83/tumblr_p11f0jWvo11qgu742o2_400.gif" class="photoset_photo rapid-noclick-resp" id="photoset_link_168963280024_3" data-enable-lightbox="1" data-photoset-index="3">
          <img class="" style="width:268px;" src="https://78.media.tumblr.com/98b32d1a6953436e24edae0d99b14d83/tumblr_p11f0jWvo11qgu742o2_400.gif" alt="" data-pin-url="http://dulciesgf.tumblr.com/post/168625598140/dont-do-tippy-toes-again-though" data-pin-description="dulciesgf">
        </a>
        <a href="https://78.media.tumblr.com/e42bb30fcd13a754b44be5ee716555d2/tumblr_p11f0jWvo11qgu742o3_400.gif" class="photoset_photo rapid-noclick-resp" id="photoset_link_168963280024_4" data-enable-lightbox="1" data-photoset-index="4">
          <img class="" style="width:268px;" src="https://78.media.tumblr.com/e42bb30fcd13a754b44be5ee716555d2/tumblr_p11f0jWvo11qgu742o3_400.gif" alt="" data-pin-url="http://dulciesgf.tumblr.com/post/168625598140/dont-do-tippy-toes-again-though" data-pin-description="dulciesgf">
        </a>        
      </div>
    </div>
    */
    $(post).find("div.photoset_row img:not(.wench-tweaks-gifdone)").each(function () {
      let $this = $(this);
      $this.addClass("wench-tweaks-gifdone");
      XKit.extensions.wench_tweaks.lowerimage($this, m_post.source_owner, m_post.root_id);
    });

    /* Image post
      <img class="post_media_photo image" alt="" width="540" height="504" style="width: 540px; height: 504px;" src="https://78.media.tumblr.com/fa371e4b94a3bf58116d780fddb58e70/tumblr_p2gl8y9SBN1w6oc4so1_500.gif" data-pin-url="https://captain-narraboth.tumblr.com/post/169627148685" data-pin-description="you're my best friend and I still love you">
    */
    $(post).find("img.post_media_photo.image:not(.wench-tweaks-gifdone)").each(function () {
      let $this = $(this);
      $this.addClass("wench-tweaks-gifdone");
      XKit.extensions.wench_tweaks.lowerimage($this, m_post.source_owner, m_post.root_id);
    });
  },

  postinfo: function (blog, post, callback) {
    let url = "https://api.tumblr.com/v2/blog/" + blog + "/posts" + "?api_key=" + XKit.api_key + "&id=" + post;

    browser.runtime.sendMessage({ command: "GET_ALLOWED", url: url }, (data) => {

      if (data) {
        callback(data)
      } else {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onerror: function () {
            callback(false);
          },
          onload: function (response) {
            let data = JSON.parse(response.responseText).response;
            if (data.total_posts != 1) {
              callback(false)
            }
            else {
              data = data.posts[0];
              browser.runtime.sendMessage({ command: "SET_ALLOWED", url: url, value: data });
              callback(data);
            }
          }
        });
      }
    })
  },

  getimageinfo: function (post, imgurl) {
    for (let p = 0; p < post.photos.length; p++) {
      let photo = post.photos[p];
      for (let a = 0; a < photo.alt_sizes.length; a++) {
        let alt = photo.alt_sizes[a];
        if (alt.url === imgurl) return { details: photo, size: a };
      }
    }

    return false;
  },

  lowerimage: function ($img, blog, postId) {
    let src = $img.attr("src");

    let match = regex.exec(src) || regexv.exec(src);
    if (match) {
      browser.runtime.sendMessage({ command: "GET_ALLOWED", url: match[1] }, (largest) => {
        let newurl;
        if (!largest) largest = 0;

        let finishup = function (newsize) {
          if (newsize == 0) {
            if (!largest) largest = match[2];
            newurl = match[1] + largest + ".gif";
            newsize = largest;
          }
          if (newsize > largest) browser.runtime.sendMessage({ command: "SET_ALLOWED", url: match[1], value: newsize });
          if (newurl) {
            browser.runtime.sendMessage({ command: "SET_ALLOWED", url: match[0], value: newurl });
            browser.runtime.sendMessage({ command: "SET_ALLOWED", url: newurl, value: newurl });
            $img.attr("src", newurl);
          }
        };

        if (largest || match[2] <= 200) {
          finishup(0);
        }
        else {

          if (blog && postId) {
            //newurl = match[0];
            XKit.extensions.wench_tweaks.postinfo(blog, postId, (post) => {
              if (!post) {
                finishup(0);
              }
              else {
                let imginfo = XKit.extensions.wench_tweaks.getimageinfo(post, match[0]);
                if (!imginfo) {
                  finishup(0);
                }

                let desired = imginfo.size + 2;
                if (desired > imginfo.details.alt_sizes.length) desired = imginfo.details.alt_sizes.length - 1;
                if (imginfo.details.alt_sizes[desired].width === 75) desired--;

                if (desired > 0) {
                  newurl = imginfo.details.alt_sizes[desired].url;
                  finishup(imginfo.details.alt_sizes[desired].width);
                }
                else {
                  finishup(0);
                }
              }
            });
          }
          else {
            finishup(0);
          }
        }
      })
    }
  }
});
