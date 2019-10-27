rsync  -auvHzP \
   --exclude='node_modules' \
   --exclude='test' \
   --exclude='.idea' \
   --exclude='.git' \
   . \
   eabigelowjr@webyarns.com:www/rptest/new-reveal
