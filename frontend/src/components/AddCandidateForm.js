import React, { useState } from 'react';
import FileUploader from './FileUploader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddCandidateForm = () => {
    const [candidate, setCandidate] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        educations: [],
        workExperiences: [],
        cv: null
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e, index, section) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][e.target.name] = e.target.value;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleDateChange = (date, index, section, field) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][field] = date;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleAddSection = (section) => {
        const newSection = section === 'educations' ? { institution: '', title: '', startDate: '', endDate: '' } : { company: '', position: '', description: '', startDate: '', endDate: '' };
        setCandidate({ ...candidate, [section]: [...candidate[section], newSection] });
    };

    const handleRemoveSection = (index, section) => {
        const updatedSection = [...candidate[section]];
        updatedSection.splice(index, 1);
        setCandidate({ ...candidate, [section]: updatedSection });
    };

    const handleCVUpload = (fileData) => {
        setCandidate({ ...candidate, cv: fileData });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const candidateData = {
                ...candidate,
                cv: candidate.cv ? {
                    filePath: candidate.cv.filePath,
                    fileType: candidate.cv.fileType
                } : null
            };

            // Format date fields to YYYY-MM-DD before sending to the endpoint
            candidateData.educations = candidateData.educations.map(education => ({
                ...education,
                startDate: education.startDate ? education.startDate.toISOString().slice(0, 10) : '',
                endDate: education.endDate ? education.endDate.toISOString().slice(0, 10) : ''
            }));
            candidateData.workExperiences = candidateData.workExperiences.map(experience => ({
                ...experience,
                startDate: experience.startDate ? experience.startDate.toISOString().slice(0, 10) : '',
                endDate: experience.endDate ? experience.endDate.toISOString().slice(0, 10) : ''
            }));

            const res = await fetch('http://localhost:3010/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidateData)
            });

            if (res.status === 201) {
                setSuccessMessage('Candidato añadido con éxito');
                setError('');
            } else if (res.status === 400) {
                const errorData = await res.json();
                throw new Error('Datos inválidos: ' + errorData.message);
            } else if (res.status === 500) {
                throw new Error('Error interno del servidor');
            } else {
                throw new Error('Error al enviar datos del candidato');
            }
        } catch (error) {
            setError('Error al añadir candidato: ' + error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-[24px] font-semibold text-[#1a1c1c] mb-6 font-['IBM_Plex_Sans']">Agregar Candidato</h1>
            <div className="bg-white border border-[#e2e2e2] rounded-[2px] p-6 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className="block text-[14px] font-medium text-[#424656] mb-1">
                                    Nombre
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    required
                                    onChange={(e) => setCandidate({ ...candidate, firstName: e.target.value })}
                                    className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                    aria-label="Nombre del candidato"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-[14px] font-medium text-[#424656] mb-1">
                                    Apellido
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    required
                                    onChange={(e) => setCandidate({ ...candidate, lastName: e.target.value })}
                                    className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                    aria-label="Apellido del candidato"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-[14px] font-medium text-[#424656] mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                                    className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                    aria-label="Correo electrónico"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-[14px] font-medium text-[#424656] mb-1">
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
                                    className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                    aria-label="Teléfono"
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-[14px] font-medium text-[#424656] mb-1">
                                    Dirección
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    onChange={(e) => setCandidate({ ...candidate, address: e.target.value })}
                                    className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                    aria-label="Dirección"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[14px] font-medium text-[#424656] mb-1">
                                    CV
                                </label>
                                <FileUploader
                                    onChange={handleCVUpload}
                                    onUpload={handleCVUpload}
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleAddSection('educations')}
                                    className="bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                    aria-label="Añadir educación"
                                >
                                    Añadir Educación
                                </button>
                            </div>
                            {candidate.educations.map((education, index) => (
                                <div key={index} className="bg-[#f9f9f9] border border-[#e2e2e2] rounded-[2px] p-4 mt-3">
                                    <div className="space-y-3">
                                        <input
                                            placeholder="Institución"
                                            name="institution"
                                            value={education.institution}
                                            onChange={(e) => handleInputChange(e, index, 'educations')}
                                            className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                            aria-label="Institución educativa"
                                        />
                                        <input
                                            placeholder="Título"
                                            name="title"
                                            value={education.title}
                                            onChange={(e) => handleInputChange(e, index, 'educations')}
                                            className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                            aria-label="Título obtenido"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <DatePicker
                                                selected={education.startDate}
                                                onChange={(date) => handleDateChange(date, index, 'educations', 'startDate')}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Fecha de Inicio"
                                                className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                                aria-label="Fecha de inicio"
                                            />
                                            <DatePicker
                                                selected={education.endDate}
                                                onChange={(date) => handleDateChange(date, index, 'educations', 'endDate')}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Fecha de Fin"
                                                className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                                aria-label="Fecha de fin"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSection(index, 'educations')}
                                            className="flex items-center gap-2 bg-[#dc3545] hover:bg-[#c82333] text-white text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                            aria-label="Eliminar educación"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleAddSection('workExperiences')}
                                    className="bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                    aria-label="Añadir experiencia laboral"
                                >
                                    Añadir Experiencia Laboral
                                </button>
                            </div>
                            {candidate.workExperiences.map((experience, index) => (
                                <div key={index} className="bg-[#f9f9f9] border border-[#e2e2e2] rounded-[2px] p-4 mt-3">
                                    <div className="space-y-3">
                                        <input
                                            placeholder="Empresa"
                                            name="company"
                                            value={experience.company}
                                            onChange={(e) => handleInputChange(e, index, 'workExperiences')}
                                            className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                            aria-label="Empresa"
                                        />
                                        <input
                                            placeholder="Puesto"
                                            name="position"
                                            value={experience.position}
                                            onChange={(e) => handleInputChange(e, index, 'workExperiences')}
                                            className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                            aria-label="Puesto"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <DatePicker
                                                selected={experience.startDate}
                                                onChange={(date) => handleDateChange(date, index, 'workExperiences', 'startDate')}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Fecha de Inicio"
                                                className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                                aria-label="Fecha de inicio"
                                            />
                                            <DatePicker
                                                selected={experience.endDate}
                                                onChange={(date) => handleDateChange(date, index, 'workExperiences', 'endDate')}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Fecha de Fin"
                                                className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                                                aria-label="Fecha de fin"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSection(index, 'workExperiences')}
                                            className="flex items-center gap-2 bg-[#dc3545] hover:bg-[#c82333] text-white text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                            aria-label="Eliminar experiencia laboral"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-3 px-4 rounded-[2px] transition-colors mt-8"
                        aria-label="Enviar formulario"
                    >
                        Enviar
                    </button>
                    {error && (
                        <div className="bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] px-4 py-3 rounded-[2px] mt-4" role="alert">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-[#d4edda] border border-[#c3e6cb] text-[#155724] px-4 py-3 rounded-[2px] mt-4" role="alert">
                            {successMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddCandidateForm;