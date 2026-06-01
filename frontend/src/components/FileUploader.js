import React, { useState } from 'react';

const FileUploader = ({ onChange, onUpload }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    onChange(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('http://localhost:3010/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Error al subir archivo');
        }

        const fileData = await res.json();
        setFileData(fileData);
        onUpload(fileData);
      } catch (error) {
        console.error('Error al subir archivo:', error);
      } finally {
        setLoading(false); // Asegura que loading se establezca a false después de la operación
      }
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="flex-1 bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd] file:mr-4 file:py-1 file:px-4 file:rounded-[2px] file:border-0 file:text-[14px] file:font-medium file:bg-[#f3f3f3] file:text-[#424656] hover:file:bg-[#e2e2e2]"
          aria-label="Seleccionar archivo"
        />
        <button
          type="button"
          onClick={handleFileUpload}
          className="bg-white border border-[#e2e2e2] hover:bg-[#f3f3f3] text-[#424656] text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors flex items-center gap-2 min-w-[120px] justify-center"
          disabled={loading}
          aria-label="Subir archivo"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#424656] border-t-transparent rounded-full animate-spin" role="status" aria-label="Cargando">
              <span className="sr-only">Cargando...</span>
            </div>
          ) : (
            'Subir Archivo'
          )}
        </button>
      </div>
      {fileName && (
        <p className="text-[14px] text-[#424656] mb-0">Archivo seleccionado: {fileName}</p>
      )}
      {fileData && (
        <p className="text-[14px] text-[#155724] mt-2">
          Archivo subido con éxito
        </p>
      )}
    </div>
  );
};

export default FileUploader;
