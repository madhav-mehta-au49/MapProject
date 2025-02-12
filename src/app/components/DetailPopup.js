import React from 'react';

export default function DetailPopup({ isOpen, onClose, data, onShowImporters, onShowExporters, onShowFPOs, isMobile, isTablet }) {
    const buttonStyle = {
        width: '100%',
        padding: isMobile ? '10px' : '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        marginBottom: '10px'
    };

    return (
        <div style={{
            position: 'absolute',
            ...(isMobile ? {
                bottom: 0,
                left: 0,
                right: 0,
                height: '80vh',
                transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                borderRadius: '20px 20px 0 0'
            } : {
                right: 0,
                top: 0,
                height: '100%',
                width: isTablet ? '400px' : '350px',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                borderRadius: '10px 0 0 10px'
            }),
            backgroundColor: 'white',
            boxShadow: '-2px 0 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1001,
            padding: isMobile ? '20px' : '25px',
        }}>
            {data && (
                <>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: isMobile ? '10px' : '15px',
                            right: isMobile ? '10px' : '15px',
                            border: 'none',
                            background: 'none',
                            fontSize: isMobile ? '20px' : '24px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '5px',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s',
                            width: isMobile ? '35px' : '40px',
                            height: isMobile ? '35px' : '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                    <div style={{ marginTop: isMobile ? '15px' : '20px' }}>
                        <h3 style={{
                            marginBottom: isMobile ? '20px' : '25px',
                            textTransform: 'capitalize',
                            color: '#2563eb',
                            fontSize: isMobile ? '20px' : '24px',
                            fontWeight: '600'
                        }}>
                            {data.type === 'importer' ? `${data.company} (Importer)` : `${data.commodity} Details`}
                        </h3>
                        <div style={{
                            padding: isMobile ? '15px' : '20px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            {/* Rest of your content remains the same */}
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#475569' }}>Company:</strong>
                                <span style={{ marginLeft: '8px', color: '#1e293b' }}>{data.company}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#475569' }}>
                                    {data.type === 'importer' ? 'Import Quantity:' : 'Weight:'}
                                </strong>
                                <span style={{ marginLeft: '8px', color: '#1e293b' }}>
                                    {data.type === 'importer' ? `${data.quantity_mt} MT` : `${data.weight} kg`}
                                </span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#475569' }}>Coordinates:</strong>
                                <div style={{ marginLeft: '8px', color: '#1e293b' }}>
                                    Longitude: {data.coordinates[0].toFixed(4)}°<br />
                                    Latitude: {data.coordinates[1].toFixed(4)}°
                                </div>
                            </div>
                        </div>
                        {data.type !== 'importer' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={onShowImporters}
                                    style={buttonStyle}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                                >
                                    View All Importers
                                </button>
                                <button
                                    onClick={onShowExporters}
                                    style={buttonStyle}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                                >
                                    View All Exporters
                                </button>
                                <button
                                    onClick={onShowFPOs}
                                    style={buttonStyle}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                                >
                                    View All FPOs
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
