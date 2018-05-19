# SNS

## Slim: 3.* & Angular Base Script

## Requirements:

* Nginx 
* PHP >= 5.5.9
* Enable extensions in **php.ini** file(OpenSSL PHP Extension, PDO PHP Extension, Mbstring PHP Extension, curl)
* Nodejs
* Composer
* Bower
* Grunt


## Server Side:
### Composer Updation:

* To Update the Composer, please run the below command in following path `/SNS/server/php/Slim`.  

        composer update
    
* The above Updation doesn't work to you, need to install Composer, please refer this link **https://getcomposer.org/**  for "**How to install Composer**".

## Import db: 

1. SNS/sql/sns_with_empty_data.sql


## Front Side:

* You need to install nodejs, bower, grunt.

* Go to "/SNS/client" path in command prompt.

* Run the below command, the bower used to download and installed all front-end development libraries.

        bower install

* The npm used to install the all dependencies in the local node_modules folder. [Click here](http://git8.ahsan.in/root/LaravelBase/blob/master/trunk/lumen/docs/Npm.md) for more npm details.

        npm install    


## Default folder create and give permission 

        /tmp
        /media

# upload to server

* need to create json, "**/SNS/client/builds/XXX.json**" [already dev.json available, take one copy and update server & db details]
* If modify the files in local, you should run the below command for further updation.  
  
  cd "/SNS/client/"

        grunt build:xxx      

