# streaming_stereo

## Condition of this program
All these codes can run perfectly in OS X El Capitan, the program of obtaining the rotation information of Oculus Rift tested only in Xcode, the type of Arduino is Arduino Uno, all html files have to run under server appache. For the part of streaming videos, it's realised by WebRTC, so please use chrome to test all html files.


###websocket-server.js

A webserver realised by websocket, it's used to exchange the configurations of two ends, then the two ends use P2P, for using this server, please go to folder cs, there is a module which is indispensable pour websocket-server.js

###Folder cs:

For sending two videos from a client to a server

###Folder datachannel

For sending the data catched in port 50000 where on put the informations de rotations from Oculus Rift

###Folder stereo

For sending an audio on stereo from a client to a server 

# Order of starting this program
Preparation: 2017
Sur toutes les machines où on souhaite exécuter les express server et client il faut préalablement télécharger rootCA.crt pour pouvoir avoir le certificat permettant d'attester que la connexion est sécurisée.
lancer les commandes node httpserver.js et node websocket_server.js sur 2 terminaux différents (ils sont dans les dossiers cs et websocket_server). 
Il faut cependant changer l'adresse présente dans le code par votre adresse ip: ici 192.168.43.253
Puis on lance dans chrome :
https://#votre adresse ip#:5000/server.html et https://#votre adresse ip#:5000/client.html


Preparation: 2016
Connect two cameras and microphones to client's computer, connect Arduino uno and Oculus Rift to server's computer

1. Start websocket-server.js by command 'node websocket-server.js'
2. generate the needed certificate before running the program
3. Connect the two devices to the server and open client.html on your android phone.


