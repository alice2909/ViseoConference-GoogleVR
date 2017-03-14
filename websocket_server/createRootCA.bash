#!/bin/bash


openssl genrsa -out ssl/rootCA.key 2048
echo "$(tput setaf 1)Clé root créée$(tput sgr0)"
openssl req -x509 -new -nodes -key ssl/rootCA.key -sha256 -days 1024 -out ssl/rootCA.crt -subj '/C=FR/ST=Is\xC3\x83\xC2\xA8re/L=Grenoble/O=LIG/OU=FabMSTIC/CN=FabMSTIC/emailAddress=fabmstic.lig@gmail.com'
echo "$(tput setaf 1)Autorité de certification créée ssl/rootCA.crt$(tput sgr0)"
echo "$(tput setaf 1)Veillez installer ce fichier sur chaque ordinateur qui pilotera un Robair.$(tput sgr0)"
sudo cp ssl/rootCA.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
