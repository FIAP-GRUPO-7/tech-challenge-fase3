import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';


import ConfirmationIcon from '../assets/images/Confirmation icon.png';
import ComprovanteIcon from '../assets/images/Icone de Comprovante.png';
import { colors, fontSize, radius, spacing } from '../styles/theme';

const generateReceiptHTML = (params, formattedDate) => {
  const { recipient, value, transactionId } = params;
  const numericValue = parseFloat(value).toFixed(2).replace('.', ',');

  return `
        <html>
        <head>
            <style>
                body { font-family: sans-serif; padding: 20px; background-color: #f7f7f7; }
                .card { background-color: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 20px; }
                .title { font-size: 20px; font-weight: bold; color: #1f2937; margin-top: 5px; }
                .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
                .label { font-size: 14px; color: #6b7280; }
                .value { font-size: 16px; font-weight: 600; color: #1f2937; }
                .value-amount { font-size: 20px; font-weight: bold; color: #00b894; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2 class="title">Comprovante de Transferência</h2>
                </div>
                
                <div class="row">
                    <span class="label">Valor</span>
                    <span class="value value-amount">R$ ${numericValue}</span>
                </div>
                
                <div class="row">
                    <span class="label">Recebedor</span>
                    <span class="value">${recipient}</span>
                </div>
                
                <div class="row">
                    <span class="label">Data e hora</span>
                    <span class="value">${formattedDate}</span>
                </div>
                
                <div class="row" style="border-bottom: none;">
                    <span class="label">ID da Transação</span>
                    <span class="value">${transactionId}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #9ca3af;">
                Documento gerado pelo sistema FIAP-BANK
            </div>
        </body>
        </html>
    `;
};


export default function Comprovante() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recipient, value, transactionId } = params;

  const { user } = useAuth();

  const numericValue = parseFloat(value);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleGenerateAndSavePDF = async () => {
    if (!transactionId || !user?.uid) {
      Alert.alert('Erro', 'ID da transação ou ID do usuário não encontrado. Operação abortada.');
      return;
    }

    try {
      const html = generateReceiptHTML(params, formattedDate);
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      if (!uri) return Alert.alert('Erro', 'Não foi possível gerar o PDF.');

      Alert.alert('Processando', 'Fazendo upload do comprovante para o Storage...', [{ text: "Aguarde" }]);

      const userId = user.uid;
      const fileName = `comprovante_${transactionId}.pdf`;

      const pdfUrl = await uploadFileFromUri(uri, fileName, userId);

      const transactionRef = doc(db, "transactions", transactionId);
      await updateDoc(transactionRef, {
        pdfReceiptUrl: pdfUrl,
        receiptUploaded: true,
      });
      Alert.alert(
        'Comprovante Salvo!',
        'O comprovante foi salvo no Firebase e agora você pode compartilhá-lo ou baixá-lo.',
        [
          {
            text: "Compartilhar/Baixar PDF",
            onPress: () => Sharing.shareAsync(uri),
            style: "default"
          },
          { text: "OK", style: "cancel" }
        ]
      );

    } catch (error) {
      console.error("Erro no PDF/Upload:", error);
      Alert.alert('Erro no Processamento', `Falha ao gerar ou salvar o comprovante. Detalhes: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.replace('/tabs/Home')}
          accessibilityLabel="Fechar comprovante"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Image source={ConfirmationIcon} style={styles.confirmationIcon} />
          <Text style={styles.successTitle}>Transferência concluída</Text>
        </View>

        {/* Card principal (Conteúdo visual inalterado) */}
        <View style={styles.receiptCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor</Text>
            <Text style={styles.valueText}>
              R$ {numericValue.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Recebedor</Text>
            <View style={styles.recipientContainer}>
              <Text style={styles.recipientName}>{recipient}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data e hora</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Concluída</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID da Transação</Text>
            <Text style={styles.detailsText}>{transactionId}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão compartilhar*/}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleGenerateAndSavePDF}
        >
          <Image source={ComprovanteIcon} style={styles.shareIcon} />
          <Text style={styles.shareButtonText}>Visualizar/Salvar Comprovante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 10,
  },
  closeButton: {
    top: spacing.md,
    left: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 25,

  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  confirmationIcon: {
    width: 30,
    height: 30,
    marginBottom: spacing.md,
    resizeMode: 'contain',
  },
  successTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  receiptCard: {
    backgroundColor: colors.text.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  recipientInitials: {
    color: colors.text.white,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
  recipientName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: spacing.sm,
  },
  valueText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.md,
    color: '#4CAF50',
    fontWeight: '600',
  },
  detailsText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  attachmentButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  attachmentText: {
    color: colors.text.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  shareButton: {
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.text.white,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  shareIcon: {
    width: 22,
    height: 22,
    marginRight: spacing.sm,
  },

});
