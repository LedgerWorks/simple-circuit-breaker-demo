#!/usr/bin/env bash
set -euo pipefail

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_DIR="$( cd "${SCRIPTS_DIR}" && cd .. && pwd )"
TIMESTAMP=$(date +%s)
NAME=$1

echo "Updating ${NAME}"

cd "$PROJECT_DIR"

npm run clean:lambdas
npm run build:${NAME}

cd "dist/lambda-artifacts"
zip -r ../function.zip ./* ../package.json

cd "$PROJECT_DIR"

aws lambda update-function-code \
  --function-name ${NAME} \
  --zip-file fileb://function.zip

