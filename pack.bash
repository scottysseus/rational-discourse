#! /bin/bash
# This script is used to package the app code for deployment

# Steps to get butler
# wget https://broth.itch.ovh/butler/linux-amd64/LATEST/archive/default -O butler.zip
# unzip butler.zip -d butler
# butler/butler login

# Pack the client code and upload
rm -f client.zip
npm run production
pushd prod
zip -r client.zip *
popd
mv prod/client.zip .

# Push it to itch.io using their "butler" tool
./butler push prod nmoadev/rational-discourse

# Pack the server code and upload
rm -f server.zip
zip -jr server server-src package.json package-lock.json
scp *.zip lightsail:/opt/bitnami/projects/aoe_jam








