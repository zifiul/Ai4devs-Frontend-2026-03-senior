import React, { useState } from 'react';

type Position = {
    title: string;
    manager: string;
    deadline: string;
    status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};

const mockPositions: Position[] = [
    { title: 'Senior Backend Engineer', manager: 'John Doe', deadline: '2024-12-31', status: 'Abierto' },
    { title: 'Junior Android Engineer', manager: 'Jane Smith', deadline: '2024-11-15', status: 'Contratado' },
    { title: 'Product Manager', manager: 'Alex Jones', deadline: '2024-07-31', status: 'Borrador' }
];

const statusStyles: Record<Position['status'], string> = {
    Abierto: 'bg-[#dbe1ff] text-[#003da9]',
    Contratado: 'bg-[#d1fae5] text-[#065f46]',
    Cerrado: 'bg-[#e2e2e2] text-[#424656]',
    Borrador: 'bg-[#f3f3f3] text-[#737687]',
};

const Positions: React.FC = () => {
    const [searchTitle, setSearchTitle] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterManager, setFilterManager] = useState('');

    const handleViewProcess = (position: Position) => {
        console.log('View process for:', position.title);
    };

    const handleEdit = (position: Position) => {
        console.log('Edit position:', position.title);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-[24px] font-semibold text-[#1a1c1c] text-center mb-6 font-['IBM_Plex_Sans']">
                Posiciones
            </h2>

            {/* Filters */}
            <div className="bg-[#f9f9f9] border border-[#e2e2e2] rounded-[2px] px-4 py-3 mb-6 flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                        placeholder="Buscar por título"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        aria-label="Buscar por título"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="date"
                        className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        aria-label="Buscar por fecha"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <select
                        className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        aria-label="Filtrar por estado"
                    >
                        <option value="">Estado</option>
                        <option value="Abierto">Abierto</option>
                        <option value="Contratado">Contratado</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Borrador">Borrador</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <select
                        className="w-full bg-white border border-[#e2e2e2] rounded-[2px] h-[34px] px-3 text-[14px] text-[#1a1c1c] outline-none focus:border-[#004ccd]"
                        value={filterManager}
                        onChange={(e) => setFilterManager(e.target.value)}
                        aria-label="Filtrar por manager"
                    >
                        <option value="">Manager</option>
                        <option value="john_doe">John Doe</option>
                        <option value="jane_smith">Jane Smith</option>
                        <option value="alex_jones">Alex Jones</option>
                    </select>
                </div>
            </div>

            {/* Position Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPositions.map((position, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#e2e2e2] rounded-[2px] p-4 hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-[16px] font-semibold text-[#1a1c1c] mb-3 font-['IBM_Plex_Sans']">
                            {position.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                            <p className="text-[14px] text-[#424656]">
                                <span className="font-medium">Manager:</span> {position.manager}
                            </p>
                            <p className="text-[14px] text-[#424656]">
                                <span className="font-medium">Deadline:</span> {position.deadline}
                            </p>
                        </div>
                        <div className="mb-4">
                            <span
                                className={`${statusStyles[position.status]} px-2 py-1 rounded-[2px] text-[12px] font-medium uppercase tracking-[0.3px] font-['IBM_Plex_Sans']`}
                                aria-label={`Estado: ${position.status}`}
                            >
                                {position.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="flex-1 bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                onClick={() => handleViewProcess(position)}
                                aria-label={`Ver proceso de ${position.title}`}
                            >
                                Ver proceso
                            </button>
                            <button
                                type="button"
                                className="flex-1 bg-[#e2e2e2] hover:bg-[#d4d4d4] text-[#424656] text-[14px] font-medium py-2 px-4 rounded-[2px] transition-colors"
                                onClick={() => handleEdit(position)}
                                aria-label={`Editar ${position.title}`}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Positions;