import React from 'react';

const LoaderSpinner = () => (
    <div style={styles.loader}>
        <div style={styles.spinner}></div>
    </div>
);

const styles = {
    loader: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    spinner: {
        border: '4px solid #008181',
        borderLeftColor: '#ffff',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
    },
};

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText =
        `@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`;
    document.head.appendChild(styleSheet);
}

export default LoaderSpinner;
