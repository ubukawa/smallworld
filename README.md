# smallworld
produce for small scale  


# How to use
docker rmi smallworld  
git clone git@github.com:ubukawa/smallworld  
cd smallworld  
docker build -t smallworld .  
docker run -it --rm -v ${PWD}:/data smallworld  
 
cd smallworld  
vi config/default.hjson  
mkdir /data/zxy   //mbtilesDir

rake // or node index.js or node index_africa.js  


# note
Regarding ogr2ogr, its default srs for output data is 4326, so we do not have to give the projection even the original postgis data is stored in another projection.     
  
Need to have gdal greater than 2.4.0  
In order to do so,   

sudo apt update  
sudo apt install software-properties-common  
sudo apt-get install python3.6-dev  
sudo add-apt-repository ppa:ubuntugis/ppa  
sudo apt-get install gdal-bin  


https://mothergeo-py.readthedocs.io/en/latest/development/how-to/gdal-ubuntu-pkg.html
https://linuxize.com/post/how-to-add-apt-repository-in-ubuntu/