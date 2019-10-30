ROOT_DIR="/var/www/alphachart"
SHARED_DIR="$ROOT_DIR/shared"
RELEASES_DIR="$ROOT_DIR/releases"
REPO_DIR="$ROOT_DIR/repo"
CURRENT_LN="$ROOT_DIR/current"

TIMESTAMP=`date +%Y%m%d%H%M%S`
WORKING_DIR="$RELEASES_DIR/$TIMESTAMP"

set -e
# trap '[ -d "$WORKING_DIR" ] && rm -Rf $WORKING_DIR' EXIT

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use node

# git clone --depth=1 https://github.com/silcam/AlphaChart.git $WORKING_DIR

cd $REPO_DIR
git pull
mkdir $WORKING_DIR
cp -R $REPO_DIR/* $WORKING_DIR/

ln -sfn $SHARED_DIR/node_modules $WORKING_DIR/node_modules
ln -sfn $SHARED_DIR/client/node_modules $WORKING_DIR/client/node_modules
# ln -sfn $SHARED_DIR/client/build $WORKING_DIR/client/build
ln -sfn $SHARED_DIR/secrets.json $WORKING_DIR/secrets.json
ln -sfn $WORKING_DIR/server/dist/server/src/server.js $WORKING_DIR/server.js

cd $WORKING_DIR/client
yarn install
yarn build
# cp -rlf $WORKING_DIR/client/build/* $SHARED_DIR/public/ 

ln -sfn $SHARED_DIR/public/images $WORKING_DIR/client/build/images
mv $WORKING_DIR/client/public $WORKING_DIR/client/public_old
ln -sfn $SHARED_DIR/public $WORKING_DIR/client/public

cd $WORKING_DIR
yarn install
yarn tsc

yarn migrate
ln -sfn $WORKING_DIR $CURRENT_LN
passenger-config restart-app $ROOT_DIR

## Cleanup

cd $RELEASES_DIR
NUM_RELEASES=`ls -1 | wc -l`
echo "CLEANUP: $NUM_RELEASES releases found..."
while [ $NUM_RELEASES -gt 3 ]
do
    TO_REMOVE=`ls -1t | tail -1`
    echo "Remove release $TO_REMOVE..."
    rm -rf $TO_REMOVE
    NUM_RELEASES=`ls -1 | wc -l`
done