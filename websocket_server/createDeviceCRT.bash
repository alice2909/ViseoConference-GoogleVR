#!/bin/bash

openssl genrsa -out ssl/device.key 2048
openssl req -new -key ssl/device.key -out ssl/device.csr -subj '/C=FR/ST=Is\xC3\x83\xC2\xA8re/L=Grenoble/O=LIG/OU=FabMSTIC/CN='"$1"'/emailAddress=fabmstic.lig@gmail.com'
openssl x509 -req -in ssl/device.csr -CA ssl/rootCA.crt -CAkey ssl/rootCA.key -CAcreateserial -out ssl/device.crt -days 500 -sha256

