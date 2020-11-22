#! /bin/bash
# This script is used to package the app code for deployment

# Steps to get butler
# wget https://broth.itch.ovh/butler/linux-amd64/LATEST/archive/default -O butler.zip
# unzip butler.zip -d butler
# butler/butler login

# Change the value of the serverUrl
sed -i "s/http:\/\/localhost:3000/https:\/\/www.nmoadev.net\//" src/config.js

npm install

# Pack the client code and upload
rm -f client.zip
npm run production
pushd prod
zip -r client.zip *
popd
mv prod/client.zip .

# Push it to itch.io using their "butler" tool
./butler/butler push client.zip nmoadev/rational-discourse:windows

# Pack the server code and upload
rm -f server.zip
sed -i "s/3001/3000/" server-src/config.json
zip -jr server server-src package.json package-lock.json
scp server.zip lightsail:/opt/bitnami/projects/aoe_jam
ssh lightsail "cd /opt/bitnami/projects/aoe_jam && unzip -o server.zip && npm install --production && sudo /opt/bitnami/ctlscript.sh restart apache"