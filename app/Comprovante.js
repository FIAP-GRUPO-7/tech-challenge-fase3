import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ConfirmationIcon from '../assets/images/Confirmation icon.png';
import { colors, fontSize, radius, spacing } from '../styles/theme';

export default function Comprovante() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recipient, value, transactionId, attachmentUrl } = params;
  
  const numericValue = parseFloat(value);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleShare = async () => {
    try {
      const message = `Transferência realizada!\n\n` +
        `Para: ${recipient}\n` +
        `Valor: R$ ${numericValue.toFixed(2).replace('.', ',')}\n` +
        `Data: ${formattedDate}\n` +
        `ID: ${transactionId}`;
      
      await Share.share({
        message: message,
        title: 'Comprovante de Transferência'
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o comprovante.');
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

        {/* Card principal */}
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

          {attachmentUrl && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={() => Linking.openURL(attachmentUrl)}
              >
                <Text style={styles.attachmentText}>Ver comprovante anexo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Botão compartilhar */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Compartilhar comprovante</Text>
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
});
