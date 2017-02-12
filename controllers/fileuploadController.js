var knox = require('knox');
var _ = require('underscore');
module.exports = {
    uploadFiletoS3: function (req, res) {

        /*
         * Here Knox creates an Amazon S3 client using authorized properties (key,secret and bucket)
         */

        // knox.createClient() method returns an object. By using this object we can upload file into Amazons3
        console.log(req.files);
        var rand = new Date().getTime();
        var splitted = req.files[0].mimetype.split("/");
        var client = knox.createClient({
            key: 'AKIAIIHT56YD3YVZJ5YA',
            secret: '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',
            bucket: 'squarepanda-dev'
        });

        /*In the putFile() method first arguement is file path which is stored in server side.
         *Second arguement is file path which will be store in Amazon S3 Bucket
         * Third one is for provide public read permissions for access uploaded file, By default it is private.*/


        console.log(rand,splitted);
        client.putFile(req.files[0].path , req.files[0].filename + '.' + splitted[1], {'x-amz-acl': 'public-read'}, function (err, response) {

            if (err) {
                return res.status(500).send(err);
            }
            else {
                var fs = require('fs');
                fs.exists(req.files[0].path, function(exists) {
                    console.log(exists);
                    if(exists) {
                        //Show in green
                        console.log('File exists. Deleting now ...');
                        fs.unlink(req.files[0].path);
                    } else {
                        //Show in red
                        console.log('File not found, so not deleting.');
                    }
                });
                return res.status(200).send({"url": response.req.url});

            }
        });


    },
    uploadFile:function (req, res) {
        console.log("upload");

        var validated = true,
            settings = {
                allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
                maxBytes: 10 * 1024 * 1024
            }, uploadFile = req.file('content');

        if (uploadFile && uploadFile._files.length !== 0) {

            var upload = uploadFile._files[0].stream,
                headers = upload.headers,
                byteCount = upload.byteCount

            // Validate file type
            /* if (_.indexOf(settings.allowedTypes, headers['content-type']) === -1) {
             validated = false;
             uploadFile.upload({}, function (err, result) {
             return res.status(400).send({error: 'error.file.type.wrong'});
             });
             }*/

            // Validate file size
            if (byteCount > settings.maxBytes) {
                validated = false;
                uploadFile.upload({}, function (err, callback) {
                    return res.status(400).send({error: "Upload limit of 10000000 bytes exceeded"});
                    //return res.status(400).send({error: 'error.file.size.exceeded'});
                });

            }
        } else {
            console.log("empty");
            validated = false;
            uploadFile.upload({}, function (err, callback) {
                return res.status(400).send({error: 'error.file.upload.empty'});
            });

        }
        if (validated) {
            console.log("Started uploading...");

            uploadFile.upload({
                adapter: require('skipper-s3'),
                key: 'AKIAIIHT56YD3YVZJ5YA',
                secret: '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',
                bucket: 'squarepanda-dev',
                headers: {
                    'x-amz-acl': 'public-read'
                }
            }, function (err, filesUploaded) {

                if (err) return res.status(500).send(err);

                else if (filesUploaded.length === 0) {

                    return res.status(400).send({error: 'error.file.upload.empty'});
                } else {
                    _.each(filesUploaded, function (list, index) {

                        list.url = list.extra.Location;
                        delete list.extra;

                    });

                    return res.status(200).send({
                        files: filesUploaded
                    });
                }


            });
        }

    }
};

