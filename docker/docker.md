## Docker Image 

### Setup 
1) Docker build command 
    `docker build context`
    docker build . : This will automatically assign the current working directory as context and a file name Dockerfile to read to as docker script for builder

    `docker build -f custom-filename -t image-name:tag-name .`
    `docker build -f pathToDockerFile build-context`

### Docker image 
1) Through build context, file system are made accessible to builder, whenever build command is fired, builder checks for .dockerignore file, if present all the matching directory is removed from context. 

2) 

### How to build image 
- use command `docker build buildContext`
- build context means the context for which the image needs to be build(basically the app.js services... etc )
- *sample command* `docker build .` : this means the Dockerfile and build context are present at same directory. 



### How to build image when Dockerfile is not in the context ?
### How to build when i need to provide context at some other place ?

`docker build -f cutomfilePath -t imageName:tag buildContext`


## Container 
1) `docker run imageName`
    eg: ``container run imageName:tag``

2) `docker run -it imageName sh`

3) `docker run -d imageName`


## Volumes 
1) Volumes are stored at `/var/lib/docker/volumes/``

2) `docker volumne create my-volume`

3) `docker volume inspect my-volume`

4) `docker volumne rm my-vol`

5) `docker volume ls `