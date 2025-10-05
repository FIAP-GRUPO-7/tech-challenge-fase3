import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView } from 'react-native-webview';
import { db } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { colors, fontSize, radius, spacing } from "../../styles/theme";

import AvatarImg from "../../assets/images/Avatar.png";
import { styles as homeStyles } from "../../styles/HomeStyles";

const CATEGORIAS = ["Todos", "Compras", "Salário", "Transporte", "Transferência", "Depósito"];
const TIPOS = ["Todos", "Entradas", "Saídas"];

const extractNameFromEmail = (email) => {
  if (!email) return '';
  const namePart = email.split('@')[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

//MODAL PARA EXIBIR O COMPROVANTE
const ReceiptModal = ({ isVisible, onClose, pdfUrl, transaction }) => {
  const transactionId = transaction?.transactionId || transaction?.id || 'N/A';

  if (!pdfUrl) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.receiptModalView}>
            <Text style={styles.receiptModalTitle}>Comprovante</Text>
            <Text style={styles.noReceiptText}>
              Nenhum comprovante em PDF anexado para esta transação ({transactionId}).
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
      <View style={styles.receiptHeader}>
        <Text style={styles.receiptHeaderTitle}>Comprovante de {transaction.type || 'Transação'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeHeaderButton}>
          <Text style={styles.closeHeaderText}>X</Text>
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
        startInLoadingState={true}
        allowsFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowingReadAccessToURL={true}
      />
    </Modal>
  );
};

const CustomDropdown = ({ isVisible, options, onSelect, onClose, buttonLayout }) => {
  if (!isVisible || !buttonLayout) return null;

  const dropdownStyle = {
    position: 'absolute',
    top: buttonLayout.py + buttonLayout.height + 5,
    left: buttonLayout.px,
    width: buttonLayout.width,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    borderColor: '#4B5563',
    borderWidth: 1,
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1}>
        <View style={dropdownStyle}>
          {options.map(option => (
            <TouchableOpacity key={option} style={styles.dropdownItem} onPress={() => onSelect(option)}>
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


export default function Transactions() {
  useAuthGuard();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false);

  //Modal do comprovante
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [categoryButtonLayout, setCategoryButtonLayout] = useState(null);
  const [typeButtonLayout, setTypeButtonLayout] = useState(null);

  const categoryButtonRef = useRef(null);
  const typeButtonRef = useRef(null);

  const displayName = user?.displayName || extractNameFromEmail(user?.email);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Erro ao carregar transações:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredTransactions = useMemo(() => {
    let transactions = [...allTransactions];
    if (searchQuery) { transactions = transactions.filter(t => (t.type?.toLowerCase().includes(searchQuery.toLowerCase())) || (t.recipient?.toLowerCase().includes(searchQuery.toLowerCase()))); }
    if (selectedType === "Entradas") { transactions = transactions.filter(t => t.value >= 0); }
    else if (selectedType === "Saídas") { transactions = transactions.filter(t => t.value < 0); }
    if (selectedCategory && selectedCategory !== "Todos") { transactions = transactions.filter(t => t.type === selectedCategory); }
    if (selectedDate) { transactions = transactions.filter(t => t.createdAt?.toDate().toLocaleDateString('pt-BR') === selectedDate.toLocaleDateString('pt-BR')); }
    return transactions;
  }, [allTransactions, searchQuery, selectedType, selectedCategory, selectedDate]);

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
  };

  const handleCategoryPress = () => {
    if (categoryButtonRef.current) {
      categoryButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setCategoryButtonLayout({ px, py, width, height });
        setTypeDropdownVisible(false);
        setCategoryDropdownVisible(v => !v);
      });
    }
  };

  const handleTypePress = () => {
    if (typeButtonRef.current) {
      typeButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setTypeButtonLayout({ px, py, width, height });
        setCategoryDropdownVisible(false);
        setTypeDropdownVisible(v => !v);
      });
    }
  };

  // Abre o modal
  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalVisible(true);
  };

  //Fecha o modal
  const handleCloseReceiptModal = () => {
    setIsReceiptModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderTx = ({ item }) => {
    const isExpense = item.value < 0;
    const valueColor = isExpense ? colors.danger : colors.accent;
    const displayValue = `R$ ${Math.abs(item.value).toFixed(2)}`;

    return (
      <TouchableOpacity
        style={styles.transactionRow}
        onPress={() => handleTransactionPress(item)}
      >
        <Text style={styles.tableCell}>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('pt-BR') : "—"}</Text>
        <Text style={styles.tableCell}>{item.type || "—"}</Text>
        <Text style={[styles.tableCell, { color: valueColor, fontWeight: 'bold' }]}>{isExpense ? `-${displayValue}` : `+${displayValue}`}</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>Data</Text>
      <Text style={styles.listHeaderText}>Tipo</Text>
      <Text style={styles.listHeaderText}>Valor</Text>
    </View>
  );

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={AvatarImg} style={homeStyles.avatar} />
          <Text style={homeStyles.headerText}>Olá, {user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Text style={{ color: colors.text.black, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backButton}>‹</Text></TouchableOpacity>
          <Text style={styles.pageTitle}>Transações</Text>
          <TouchableOpacity style={styles.newTransactionButton} onPress={() => router.push('/tabs/add')}><Text style={styles.newTransactionButtonText}>+ Nova Transação</Text></TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.filterButtonText}>📅 {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Data'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              ref={categoryButtonRef}
              style={styles.filterButton}
              onPress={handleCategoryPress}
            >
              <Text style={styles.filterButtonText}>{selectedCategory || 'Categoria'} ▾</Text>
            </TouchableOpacity>
            <TouchableOpacity
              ref={typeButtonRef}
              style={styles.filterButton}
              onPress={handleTypePress}
            >
              <Text style={styles.filterButtonText}>{selectedType} ▾</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (<DateTimePicker value={selectedDate || new Date()} mode="date" display="default" onChange={onDateChange} />)}

        {loading ? (<ActivityIndicator style={{ flex: 1 }} size="large" color={colors.secondary} />) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(t) => t.id}
            renderItem={renderTx}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>Nenhuma transação encontrada</Text>}
            contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 120 }}
          />
        )}
      </View>

      <CustomDropdown
        isVisible={categoryDropdownVisible}
        options={CATEGORIAS}
        onSelect={(option) => { setSelectedCategory(option); setCategoryDropdownVisible(false); }}
        onClose={() => setCategoryDropdownVisible(false)}
        buttonLayout={categoryButtonLayout}
      />
      <CustomDropdown
        isVisible={typeDropdownVisible}
        options={TIPOS}
        onSelect={(option) => { setSelectedType(option); setTypeDropdownVisible(false); }}
        onClose={() => setTypeDropdownVisible(false)}
        buttonLayout={typeButtonLayout}
      />

      {/*Modal do Comprovante */}
      <ReceiptModal
        isVisible={isReceiptModalVisible}
        onClose={handleCloseReceiptModal}
        pdfUrl={selectedTransaction?.pdfReceiptUrl}
        transaction={selectedTransaction}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.md, backgroundColor: '#fff' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, },
  pageTitle: { fontSize: fontSize.lg, fontWeight: "600", },
  backButton: { fontSize: 30, fontWeight: '300', },
  newTransactionButton: { backgroundColor: colors.secondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.xl, },
  newTransactionButtonText: { color: colors.text.white, fontWeight: '600', fontSize: 12, },

  filtersContainer: { marginTop: spacing.sm, paddingBottom: spacing.md, marginHorizontal: -4, },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md, },
  searchIcon: { fontSize: 16, marginRight: spacing.sm, },
  searchInput: { flex: 1, paddingVertical: spacing.md, },
  filterButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', },
  filterButton: { backgroundColor: '#F3F4F6', borderRadius: radius.md, padding: spacing.md, flex: 1, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  filterButtonText: { color: colors.text.secondary },

  listHeader: { flexDirection: 'row', paddingVertical: spacing.md, backgroundColor: '#F9FAFB', borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, marginHorizontal: -spacing.md, },

  listHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold', color: colors.text.muted, fontSize: fontSize.sm, },

  transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginHorizontal: -spacing.md, },

  tableCell: { flex: 1, textAlign: 'center', color: colors.text.secondary, fontSize: fontSize.sm, },
  dropdownItem: { padding: spacing.md, },
  dropdownItemText: { color: colors.text.white, fontSize: fontSize.md, },


  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    backgroundColor: colors.primary,
  },
  receiptHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  closeHeaderButton: {
    padding: spacing.sm,
  },
  closeHeaderText: {
    fontSize: 20,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  receiptModalView: {
    margin: 20,
    width: '80%',
    backgroundColor: colors.text.white,
    borderRadius: radius.lg,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  receiptModalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  noReceiptText: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  closeButton: {
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    padding: spacing.md,
    elevation: 2,
  },
  closeButtonText: {
    color: colors.text.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
