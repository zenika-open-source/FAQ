(window.webpackJsonp = window.webpackJsonp || []).push([
  [7],
  {
    "./src/advanced/multi_tenancy.mdx": function(e, n, t) {
      "use strict";
      t.r(n),
        t.d(n, "default", function() {
          return u;
        });
      var a = t("./node_modules/react/index.js"),
        o = t.n(a),
        r = t("./node_modules/@mdx-js/tag/dist/index.js");
      function m(e) {
        return (m =
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator
            ? function(e) {
                return typeof e;
              }
            : function(e) {
                return e &&
                  "function" === typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? "symbol"
                  : typeof e;
              })(e);
      }
      function c(e, n) {
        if (null == e) return {};
        var t,
          a,
          o = (function(e, n) {
            if (null == e) return {};
            var t,
              a,
              o = {},
              r = Object.keys(e);
            for (a = 0; a < r.length; a++)
              (t = r[a]), n.indexOf(t) >= 0 || (o[t] = e[t]);
            return o;
          })(e, n);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          for (a = 0; a < r.length; a++)
            (t = r[a]),
              n.indexOf(t) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(e, t) &&
                  (o[t] = e[t]));
        }
        return o;
      }
      function p(e, n) {
        for (var t = 0; t < n.length; t++) {
          var a = n[t];
          (a.enumerable = a.enumerable || !1),
            (a.configurable = !0),
            "value" in a && (a.writable = !0),
            Object.defineProperty(e, a.key, a);
        }
      }
      function l(e, n) {
        return !n || ("object" !== m(n) && "function" !== typeof n)
          ? (function(e) {
              if (void 0 === e)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return e;
            })(e)
          : n;
      }
      function i(e) {
        return (i = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function(e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
      }
      function s(e, n) {
        return (s =
          Object.setPrototypeOf ||
          function(e, n) {
            return (e.__proto__ = n), e;
          })(e, n);
      }
      var u = (function(e) {
        function n(e) {
          var t;
          return (
            (function(e, n) {
              if (!(e instanceof n))
                throw new TypeError("Cannot call a class as a function");
            })(this, n),
            ((t = l(this, i(n).call(this, e))).layout = null),
            t
          );
        }
        var t, a, m;
        return (
          (function(e, n) {
            if ("function" !== typeof n && null !== n)
              throw new TypeError(
                "Super expression must either be null or a function"
              );
            (e.prototype = Object.create(n && n.prototype, {
              constructor: { value: e, writable: !0, configurable: !0 }
            })),
              n && s(e, n);
          })(n, o.a.Component),
          (t = n),
          (a = [
            {
              key: "render",
              value: function() {
                var e = this.props,
                  n = e.components;
                c(e, ["components"]);
                return o.a.createElement(
                  r.MDXTag,
                  { name: "wrapper", components: n },
                  o.a.createElement(
                    r.MDXTag,
                    {
                      name: "h1",
                      components: n,
                      props: { id: "multi-tenancy" }
                    },
                    "Multi-tenancy"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "FAQ is a ",
                    o.a.createElement(
                      r.MDXTag,
                      {
                        name: "a",
                        components: n,
                        parentName: "p",
                        props: {
                          href: "https://en.wikipedia.org/wiki/Multitenancy"
                        }
                      },
                      "multi-tenancy"
                    ),
                    " application. You can have multiple services served with only instance of the stack (Frontend / Backend / Prisma / DB)."
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "If you do not specify a service during the installation, you will have a default service name and stage (default/default)."
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    {
                      name: "h2",
                      components: n,
                      props: { id: "how-to-create-a-new-service" }
                    },
                    "How to create a new service"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "Execute the following command:"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "pre", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      {
                        name: "code",
                        components: n,
                        parentName: "pre",
                        props: { className: "language-bash" }
                      },
                      "# Path: ./FAQ/server/\nnpm run new_service [service_name] [service_stage]\n\n# Example: npm run new_service zenika pre-prod\n"
                    )
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "You now have a new service!"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "blockquote", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      { name: "p", components: n, parentName: "blockquote" },
                      "For the complete configuration of your service, see the ",
                      o.a.createElement(
                        r.MDXTag,
                        {
                          name: "a",
                          components: n,
                          parentName: "p",
                          props: { href: "/advanced/configuration" }
                        },
                        "configuration documentation"
                      ),
                      ". Don't forget to redeploy and restart the server after you changed the configuration!"
                    )
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    {
                      name: "h2",
                      components: n,
                      props: { id: "service-routing-in-production" }
                    },
                    "Service routing in production"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "While in production, the service accessed will depend on the url you are at:"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "pre", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      {
                        name: "code",
                        components: n,
                        parentName: "pre",
                        props: {}
                      },
                      "https://[service_stage?].[service_name?].[FAQ_URL]/\n"
                    )
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "table", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      { name: "thead", components: n, parentName: "table" },
                      o.a.createElement(
                        r.MDXTag,
                        { name: "tr", components: n, parentName: "thead" },
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "th",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "name"
                        ),
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "th",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "value"
                        )
                      )
                    ),
                    o.a.createElement(
                      r.MDXTag,
                      { name: "tbody", components: n, parentName: "table" },
                      o.a.createElement(
                        r.MDXTag,
                        { name: "tr", components: n, parentName: "tbody" },
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "FAQ_URL"
                        ),
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "Provided from environment variables"
                        )
                      ),
                      o.a.createElement(
                        r.MDXTag,
                        { name: "tr", components: n, parentName: "tbody" },
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "service_name"
                        ),
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "The name of the service. Default: ",
                          o.a.createElement(
                            r.MDXTag,
                            {
                              name: "inlineCode",
                              components: n,
                              parentName: "td"
                            },
                            "default"
                          )
                        )
                      ),
                      o.a.createElement(
                        r.MDXTag,
                        { name: "tr", components: n, parentName: "tbody" },
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "service_stage"
                        ),
                        o.a.createElement(
                          r.MDXTag,
                          {
                            name: "td",
                            components: n,
                            parentName: "tr",
                            props: { align: null }
                          },
                          "The stage of the service. Default: ",
                          o.a.createElement(
                            r.MDXTag,
                            {
                              name: "inlineCode",
                              components: n,
                              parentName: "td"
                            },
                            "prod"
                          )
                        )
                      )
                    )
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "p", components: n },
                    "Examples with FAQ_URL=faq.team (",
                    o.a.createElement(
                      r.MDXTag,
                      { name: "inlineCode", components: n, parentName: "p" },
                      "name / stage"
                    ),
                    "):"
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "ul", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      { name: "li", components: n, parentName: "ul" },
                      "faq.team => ",
                      o.a.createElement(
                        r.MDXTag,
                        { name: "inlineCode", components: n, parentName: "li" },
                        "default / prod"
                      )
                    ),
                    o.a.createElement(
                      r.MDXTag,
                      { name: "li", components: n, parentName: "ul" },
                      "demo.faq.team => ",
                      o.a.createElement(
                        r.MDXTag,
                        { name: "inlineCode", components: n, parentName: "li" },
                        "demo / prod"
                      )
                    ),
                    o.a.createElement(
                      r.MDXTag,
                      { name: "li", components: n, parentName: "ul" },
                      "dev.demo.faq.team => ",
                      o.a.createElement(
                        r.MDXTag,
                        { name: "inlineCode", components: n, parentName: "li" },
                        "demo / dev"
                      )
                    )
                  ),
                  o.a.createElement(
                    r.MDXTag,
                    { name: "blockquote", components: n },
                    o.a.createElement(
                      r.MDXTag,
                      { name: "p", components: n, parentName: "blockquote" },
                      "Note 1: If NODE_ENV!=production or if no FAQ_URL is found in your frontend environment variables, the default routing will return ",
                      o.a.createElement(
                        r.MDXTag,
                        { name: "inlineCode", components: n, parentName: "p" },
                        "default/default"
                      )
                    ),
                    o.a.createElement(
                      r.MDXTag,
                      { name: "p", components: n, parentName: "blockquote" },
                      "Note 2: The routing can be overrided using VITE_PRISMA_SERVICE=name/stage in your frontend"
                    )
                  )
                );
              }
            }
          ]) && p(t.prototype, a),
          m && p(t, m),
          n
        );
      })();
      u.__docgenInfo = {
        description: "",
        methods: [],
        displayName: "MDXContent"
      };
    }
  }
]);
//# sourceMappingURL=src-advanced-multi-tenancy.b1ce0c083524ef40d530.js.map
