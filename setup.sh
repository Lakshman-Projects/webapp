#!/bin/bash

# Check if all 7 arguments are provided
if [ "$#" -ne 7 ]; then
    echo "Usage: $0 <DB_NAME> <DEV_DB_NAME> <TEST_DB_NAME> <DB_USER> <DB_PASSWORD> <APP_GROUP> <APP_USER>"
    exit 1
fi

# Assign arguments to variables
DB_NAME="$1"
DEV_DB_NAME="$2"
TEST_DB_NAME="$3"
DB_USER="$4"
DB_PASSWORD="$5"
APP_GROUP="$6"
APP_USER="$7"

# Other Variables
APP_ZIP="/tmp/lakshman_siva_*.zip"
APP_DIR="/opt/csye6225"
FILE_TO_MOVE="/tmp/.env"
EXTRACTED_APP_PATH="$APP_DIR/lakshman_siva_*/webapp"
EXTRACTED_APP_PATH_ALT="$APP_DIR/webapp"

# Update package lists and upgrade packages
echo "Updating package lists and upgrading packages..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y unzip

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
echo "Starting and enabling PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create the database and user in PostgreSQL
echo "Creating database $DB_NAME and user $DB_USER..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Creating database $DEV_DB_NAME and user $DB_USER..."
sudo -u postgres psql -c "CREATE DATABASE $DEV_DB_NAME;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DEV_DB_NAME TO $DB_USER;"

echo "Creating database $TEST_DB_NAME and user $DB_USER..."
sudo -u postgres psql -c "CREATE DATABASE $TEST_DB_NAME;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $TEST_DB_NAME TO $DB_USER;"

# Update the password for the PostgreSQL user
sudo sed -i 's/local   all             postgres                                peer/local   all             postgres                                md5/' /etc/postgresql/*/main/pg_hba.conf
sudo systemctl restart postgresql

# Create a new Linux group for the application
echo "Creating group $APP_GROUP..."
sudo groupadd $APP_GROUP

# Create a new user for the application
echo "Creating user $APP_USER..."
sudo useradd -m -s /bin/bash -g $APP_GROUP $APP_USER

# Unzip the application to /opt/csye6225
echo "Unzipping application to $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo unzip "$APP_ZIP" -d "$APP_DIR"

# Move a specific file from /tmp/ to the extracted application directory
echo "Moving $FILE_TO_MOVE to $EXTRACTED_APP_PATH..."
sudo mv "$FILE_TO_MOVE" $EXTRACTED_APP_PATH

# Update permissions of the folder and artifacts
echo "Updating permissions for $APP_DIR..."
sudo chown -R $APP_USER:$APP_GROUP "$APP_DIR"
sudo chmod -R 750 "$APP_DIR"

# Install Node.js (if not already installed)
echo "Installing Node.js..."
sudo apt-get install -y nodejs npm

# Navigate to the extracted application directory and run npm install and npm start
echo "Running npm install and npm start in $EXTRACTED_APP_PATH..."
cd && cd ..
cd "$EXTRACTED_APP_PATH" || cd "$EXTRACTED_APP_PATH_ALT" || { 
    echo "Failed to navigate to $EXTRACTED_APP_PATH or $EXTRACTED_APP_PATH_ALT"; 
    exit 1; 
}
sudo -u $APP_USER npm install

echo "Dev environment & dependencies setup completed!"