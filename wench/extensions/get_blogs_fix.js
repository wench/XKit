//* TITLE get_blogs_fix **//
//* VERSION 1.0.0 **//
//* DESCRIPTION **//
//* DEVELOPER Alexis Ryan **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.get_blogs_fix = new Object({

  handler: {
    get: function (oTarget, sKey) {
      return oTarget.blogs[sKey];
    },
    set: function (oTarget, sKey, vValue) {
      oTarget.blogs[sKey] = vValue;
      return true;
    },
    deleteProperty: function (oTarget, sKey) {
      return delete oTarget.blogs[sKey];
    },
    enumerate: function (oTarget) {
      return oTarget.blogs.keys();
    },
    ownKeys: function (oTarget) {
      return Object.getOwnPropertyNames(oTarget.blogs);
    },
    has: function (oTarget, sKey) {
      return sKey in oTarget.blogs;
    },
    defineProperty: function (oTarget, sKey, oDesc) {
      return oTarget.blogs.defineProperty(sKey,oDesc);
    },
    getOwnPropertyDescriptor: function (oTarget, sKey) {
      return Object.getOwnPropertyDescriptor(oTarget.blogs, sKey);
    }
  },
  
  get_blogs: null,
  
  run: function() {
    if (!this.get_blogs) {
      this.get_blogs = XKit.tools.get_blogs;
      XKit.tools.get_blogs = function() {
        debugger;
        return new Proxy({
          get blogs() {
            debugger;
            delete this.blogs;
            return this.blogs = XKit.extensions.get_blogs_fix.get_blogs();
          }
        },XKit.extensions.get_blogs_fix.handler);
      };
      var current_extensions = XKit.installed.list();
      // we want to make sure we are the first after the internal xkit ones
      var ourindex=-1;
      var firstnonxkit=-1;
      for (var i = 0; i < current_extensions.length; i++) {
        if (firstnonxkit < 0 && !current_extensions[i].startsWith('xkit_')) firstnonxkit = i;
        if (ourindex < 0 && current_extensions[i] == 'get_blogs_fix') ourindex = i;
        if (ourindex >=0 && firstnonxkit >= 0) break;
      }
      if (ourindex != firstnonxkit) {
        current_extensions.splice(ourindex, 1);
        current_extensions.splice(firstnonxkit, 0, 'get_blogs_fix');
        var installed_extensions = {extensions: current_extensions};
        m_string = JSON.stringify(installed_extensions);
        XKit.tools.set_setting("xkit_installed_extensions",m_string);
      }
    }
  },

  destroy: function() {
    if (this.get_blogs) {
      XKit.tools.get_blogs = this.get_blogs;
      this.get_blogs = null;
    }
  }
});

