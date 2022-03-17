npm run webyarns:build
rsync  -auvHzP \
   --exclude='node_modules' \
   --exclude='test' \
   --exclude='.idea' \
   --exclude='.git' \
   . \
   eabigelowjr@webyarns.com:www/rptest/new-reveal

rsync  -auvHzP \
   webyarns-util/lib\
   js\
   css \
   /home/rparree/documents/nextcloud-private/shares/alan/webyarns-reveal/
