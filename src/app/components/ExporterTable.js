export default function ExporterTable({ isOpen, onClose, exporters, selectedCommodity, isMobile }) {
    console.log('ExporterTable props:', { exporters, selectedCommodity });
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
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ 
                        margin: 0, 
                        color: '#2563eb',
                        fontSize: isMobile ? '24px' : '28px',
                        fontWeight: '600'
                    }}>
                        All Exporters
                    </h2>
                    <button onClick={onClose} style={closeButtonStyle}>×</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th style={tableHeaderStyle}>Company</th>
                                <th style={tableHeaderStyle}>Location</th>
                                <th style={tableHeaderStyle}>Export Quantity (MT)</th>
                                <th style={tableHeaderStyle}>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(exporters) && exporters.map((exporter) => (
                                <tr key={exporter.id} style={tableRowStyle}>
                                    <td style={tableCellStyle}>{exporter.company}</td>
                                    <td style={tableCellStyle}>{exporter.location}</td>
                                    <td style={tableCellStyle}>{exporter.quantity_mt}</td>
                                    <td style={tableCellStyle}>{exporter.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    minWidth: '600px'
};

const tableHeaderStyle = {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
    color: '#475569',
    fontSize: '16px'
};

const tableCellStyle = {
    padding: '16px',
    color: '#1e293b',
    fontSize: '15px'
};

const tableRowStyle = {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
};

const closeButtonStyle = {
    border: 'none',
    background: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#666',
    padding: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
};
