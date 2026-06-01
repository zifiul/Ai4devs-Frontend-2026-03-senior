import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/lti-logo.png';

const RecruiterDashboard = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-center mb-8">
                <img src={logo} alt="LTI Logo" className="w-[150px]" />
            </div>
            <h1 className="text-[32px] font-semibold text-[#1a1c1c] text-center mb-8 font-['IBM_Plex_Sans']">
                Dashboard del Reclutador
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#e2e2e2] rounded-[2px] p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h5 className="text-[18px] font-semibold text-[#1a1c1c] mb-4 font-['IBM_Plex_Sans']">
                        Añadir Candidato
                    </h5>
                    <Link to="/add-candidate">
                        <button
                            type="button"
                            className="w-full bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-3 px-4 rounded-[2px] transition-colors"
                            aria-label="Añadir nuevo candidato"
                        >
                            Añadir Nuevo Candidato
                        </button>
                    </Link>
                </div>
                <div className="bg-white border border-[#e2e2e2] rounded-[2px] p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h5 className="text-[18px] font-semibold text-[#1a1c1c] mb-4 font-['IBM_Plex_Sans']">
                        Ver Posiciones
                    </h5>
                    <Link to="/positions">
                        <button
                            type="button"
                            className="w-full bg-[#004ccd] hover:bg-[#003da9] text-white text-[14px] font-medium py-3 px-4 rounded-[2px] transition-colors"
                            aria-label="Ir a posiciones"
                        >
                            Ir a Posiciones
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;