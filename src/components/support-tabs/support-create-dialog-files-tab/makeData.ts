export class fileDataClass {
  id?: number;
  fileName?: string;
  dateOfCreation?: string;
  author?: string;
  idRequest?: string;
  fileSize?: number;
  fileType?: string;
}

// Функция для получения следующего ID
const getNextFileId = (): number => {
  const maxId = uploadedFiles.reduce((max, file) => 
    Math.max(max, file.id || 0), 0
  );
  return maxId + 1;
};

// Функция для добавления файла
export const addFileToMakeData = (fileData: Omit<fileDataClass, 'id'>): fileDataClass => {
  const newFile: fileDataClass = {
    id: getNextFileId(),
    ...fileData
  };
  
  uploadedFiles.push(newFile);
  return newFile;
};

// Функция для получения всех файлов
export const getAllFiles = (): fileDataClass[] => {
  return [...uploadedFiles]; // Возвращаем копию массива
};

// Функция для получения файлов по ID заявки
export const getFilesByRequestId = (requestId: string | undefined): fileDataClass[] => {
  return uploadedFiles.filter(file => file.idRequest === requestId);
};

// Функция для удаления файла по ID
export const deleteFileFromMakeData = (fileId: number): boolean => {
  const initialLength = uploadedFiles.length;
  uploadedFiles = uploadedFiles.filter(file => {
    const shouldKeep = file.id !== fileId;
    console.log(`Файл ID: ${file.id}, удаляем? ${!shouldKeep}`);
    return shouldKeep;
  });
  const success = uploadedFiles.length < initialLength;
  return success;
};

export let uploadedFiles: fileDataClass[] = [

  {
    'id': 1,
    'fileName': '1.pdf',
    'dateOfCreation': '2.19.2025',
    'author': 'Иванов И.И.',
    'idRequest':'000011',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 2,
    'fileName': '2.pdf',
    'dateOfCreation': '2.10.2025',
    'author': 'Иванов А.Й.',
    'idRequest': '000011',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 3,
    'fileName': '3.pdf',
    'dateOfCreation': '1.1.2025',
    'author': 'Иванова.й.п.',
    'idRequest': '000002',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 4,
    'fileName': '235.pdf',
    'dateOfCreation': '21.10.2025',
    'author': 'Иванов И.И.',
    'idRequest': '000002',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 5,
    'fileName': '2511.pdf',
    'dateOfCreation': '2.10.2025',
    'author': 'Иванов А.Й.',
    'idRequest': '000003',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 6,
    'fileName': '346.pdf',
    'dateOfCreation': '1.1.2025',
    'author': 'Иванова.й.п.',
    'idRequest': '000003',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 7,
    'fileName': '12546.pdf',
    'dateOfCreation': '21.10.2025',
    'author': 'Иванов И.И.',
    'idRequest': '000004',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 8,
    'fileName': '23576.pdf',
    'dateOfCreation': '2.10.2025',
    'author': 'Иванов А.Й.',
    'idRequest': '000004',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  },
  {
    'id': 9,
    'fileName': '3471.pdf',
    'dateOfCreation': '1.1.2025',
    'author': 'Иванова.й.п.',
    'idRequest': '000004',
    'fileSize': 1024 * 1024,
    'fileType': 'application/pdf'
  }

]