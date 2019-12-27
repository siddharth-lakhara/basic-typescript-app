import S3DataInterface from '../types/S3Data';
import Users from '../types/Users';

const AWS = require('aws-sdk');
const credentials = require('./credentials');

AWS.config.update({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  region: 'ap-south-1',
});

const s3 = new AWS.S3();

const uploadToS3 = (S3Data: S3DataInterface[]): Promise<any> => {
  const params = {
    Bucket: 'users-info',
    Body: JSON.stringify(S3Data),
    Key: 'usersData/data',
  };

  return s3.upload(params).promise();
};

const extractDataForS3 = (data:Users[]):S3DataInterface[] => {
  const filteredData = data.map((d) => {
    const { username, isActive } = d;
    return {
      username,
      isActive,
    };
  });
  return filteredData;
};

module.exports = {
  extractDataForS3,
  uploadToS3,
};
