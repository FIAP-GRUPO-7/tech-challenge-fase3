import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing } from '../styles/theme';

const ReceiptModal = ({ isVisible, onClose, pdfUrl, transactionId }) => {

    if (!pdfUrl) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Comprovante</Text>
                        <Text style={styles.noReceiptText}>
                            Nenhum comprovante em PDF anexado para esta transação.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Comprovante da Transação ({transactionId.substring(0, 8)}...)</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeHeaderButton}>
                    <Text style={styles.closeHeaderText}>X</Text>
                </TouchableOpacity>
            </View>
            <WebView
                source={{ uri: pdfUrl }}
                style={styles.webview}
                startInLoadingState={true}
                allowsLinkPreview={true}
                allowsFileAccess={true}
                allowFileAccessFromFileURLs={true}
                allowingReadAccessToURL={true}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: colors.primary,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.white,
    },
    closeHeaderButton: {
        padding: spacing.sm,
    },
    closeHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.white,
    },
    webview: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.text.white,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    noReceiptText: {
        marginBottom: 20,
        textAlign: 'center',
        color: colors.text.secondary,
    },
    closeButton: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    closeButtonText: {
        color: colors.text.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ReceiptModal;