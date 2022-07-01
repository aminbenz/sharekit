import { serverTimestamp } from 'firebase/firestore';

type FileProps = {
  id?: String;
  name: String;
  type: String;
  size: Number;
  sizeString: String;
  lastModified: Number;
  lastModifiedDate: any;
  downloadURL?: String;
  access: String;
  public: Boolean;
  password?: String;
  storage_duration: String;
  timestamp: any;
};

// Bytes To String
const calcBytesAndConvertToTring = (size: number | any): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(1024));

  return Math.round(size / Math.pow(1024, i)) + ' ' + sizes[i];
};

//convert file Data to Object
const fileDataToObj = (fileData: FileProps) => {
  let fileDataObj = {
    name: fileData.name,
    type: fileData.type,
    size: fileData.size,
    sizeString: calcBytesAndConvertToTring(fileData.size),
    lastModified: fileData.lastModified,
    downloadURL: fileData.downloadURL,
    public: fileData.public || true,
    access: fileData.access || 'ANYONE_WITH_LINK',
    storage_duration: fileData.storage_duration || '1_WEEK',
    password: fileData.password || '',
    downloadsCount: 0,
    timestamp: fileData.timestamp,
  };

  return fileDataObj;
};

// get Random ID
const getRandomId = (): string => {
  const fileId = new Date().getTime().toString();
  return fileId;
};

// Create File Name & path
const generateFileName = (selectedFile: FileProps): string => {
  return `${selectedFile.type.split('/')[0] || selectedFile.type}/${
    selectedFile?.name.split('.')[0]
  }_${getRandomId()}.${selectedFile?.name.split('.').at(-1)}`;
};

// text elipses
const elipses = (text: string, number: number = 20): string => {
  return text.length > number ? text.slice(0, number) + '..' : text;
};

const toDateTime = (secs: number) => {
  var time = new Date(1970, 0, 1); // Epoch
  time.setUTCSeconds(secs);
  return time.toDateString();
};

export {
  calcBytesAndConvertToTring,
  fileDataToObj,
  getRandomId,
  generateFileName,
  elipses,
  toDateTime,
};
