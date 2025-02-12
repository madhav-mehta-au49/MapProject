export default function ImporterTable({ isOpen, onClose, importers, selectedCommodity, isMobile }) {
    return (
        <div style={{
            display: isOpen ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 2000,
            padding: isMobile ? '20px' : '40px'
        }}>
            <div style={{ 
                maxWidth: '100%', 
                margin: '0 auto',
                padding: isMobile ? '10px' : '20px',
                overflowX: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ 
                        margin: 0, 
                        color: '#2563eb',
                        fontSize: isMobile ? '20px' : '28px',
                        fontWeight: '600'
                    }}>
                        All Importers
                    </h2>
                    <button onClick={onClose} style={{
                        ...closeButtonStyle,
                        fontSize: isMobile ? '24px' : '32px',
                        padding: isMobile ? '8px' : '10px'
                    }}>×</button>
                </div>
                <table style={{
                    width: '100%',
                    minWidth: isMobile ? '100%' : '600px',
                    fontSize: isMobile ? '14px' : '15px',
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <th style={tableHeaderStyle}>Company</th>
                            <th style={tableHeaderStyle}>Location</th>
                            <th style={tableHeaderStyle}>Import Quantity (MT)</th>
                            <th style={tableHeaderStyle}>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(importers) && importers.map((importer) => (
                            <tr key={importer.id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{importer.company}</td>
                                <td style={tableCellStyle}>{importer.location}</td>
                                <td style={tableCellStyle}>{importer.quantity_mt}</td>
                                <td style={tableCellStyle}>{importer.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const tableHeaderStyle = {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
    color: '#475569',
    whiteSpace: 'nowrap'
};

const tableCellStyle = {
    padding: '16px',
    color: '#1e293b'
};

const tableRowStyle = {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
};

const closeButtonStyle = {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#666',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
};
