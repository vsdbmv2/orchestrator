#!/bin/bash
CONFIG=./src/database/iedb_backups/.config-mysql
LAST=./src/database/iedb_backups/iedb_public_last.sql
CURRENT=./src/database/iedb_backups/iedb_public_current.sql
DOWNLOADED=./src/database/iedb_backups/iedb_public.sql
echo "downloading database"
pwd
deal_with_db_files(){
  rm -f $LAST &&
  [ -f $CURRENT ] && mv $CURRENT $LAST
  [ -f $DOWNLOADED ] && mv $DOWNLOADED $CURRENT
}

initial_clear(){
  rm -f ./iedb_public.sql && rm -f iedb_public.sql.gz && rm -f $DOWNLOADED
}

initial_clear &&
wget https://www.iedb.org/downloader.php?file_name=doc/iedb_public.sql.gz -O iedb_public.sql.gz
gunzip -c iedb_public.sql.gz > $DOWNLOADED
rm iedb_public.sql.gz -f
sed -i '1s/^/ CREATE DATABASE IF NOT EXISTS \`iedb_public\`\;\n USE \`iedb_public\`\;\n/' $DOWNLOADED
docker exec -i mysql-5.7 /usr/bin/mysql --defaults-extra-file=$CONFIG < $DOWNLOADED
deal_with_db_files