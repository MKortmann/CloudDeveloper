// import the aws-sdk from AWS
import AWS = require('aws-sdk');
import { config } from './config/config';

const c = config.dev;


// if it is already deployed, the machine is running inside of your instance. So, you do not need to get the credentials!
if(c.aws_profile !== "DEPLOYED") {
  //Configure AWS - it get your credentials setup in your home folder .aws
  var credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
  // we get the credentials above and saved these
  // within the AWS config credentials parameter of that service.
  // the credentials are: aws_access_key_id annd
  // aws_secret_access_key
  AWS.config.credentials = credentials;
}




//AWS S3 support two different signature version: v4 and v2.
//"AWS4-HMAC-SHA256" identifies Signature Version 4
// The variables are set at the environment variables at
// local computer or in the Instance created in the EBS
export const s3 = new AWS.S3({
  signatureVersion: c.version,
  region: c.aws_region,
  params: {Bucket: c.aws_media_bucket}
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
const EXPIRED_TIME_S = 60*5;
export function getGetSignedUrl( key: string ): string{

  const param = { Bucket: c.aws_media_bucket, Key: key, Expires: EXPIRED_TIME_S};
  const url = s3.getSignedUrl('getObject', param);
  return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ){

    const url = s3.getSignedUrl('putObject', {
      Bucket: c.aws_media_bucket,
      Key: key,
      Expires: EXPIRED_TIME_S
    });

    return url;
}
