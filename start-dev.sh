if ! [ -f "node_modules/lint-staged/bin/lint-staged.js" ] ; then
    npm i
fi

if ! [ -d ".husky/_" ] ; then
    npm run prepare
fi

source ./docker/check_and_setup_env

if [ $? -eq 1 ] ; then
    exit 1
fi

docker compose -f ./docker/docker-compose.dev.yml -p transcendence_dev down && docker compose -f ./docker/docker-compose.dev.yml -p transcendence_dev up --build;
