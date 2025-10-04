import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, radius, spacing } from "../../styles/theme";

import AvatarImg from "../../assets/images/Avatar.png";
import { styles as homeStyles } from "../../styles/HomeStyles";

const extractNameFromEmail = (email) => {
  if (!email) return '';
  const namePart = email.split('@')[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

export default function Transfer() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const displayName = user?.displayName || extractNameFromEmail(user?.email);

  useEffect(() => {
    if (!user?.uid) {
        setLoadingContacts(false);
        return;
    }
    const q = query(collection(db, "contacts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingContacts(false);
    }, (error) => {
      console.error("Erro ao buscar contatos: ", error);
      setLoadingContacts(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleNextStep = () => {
    const finalRecipient = selectedContact || recipient;
    if (!finalRecipient) {
        Alert.alert('Erro', 'Por favor, insira ou selecione um destinatário.');
        return;
    }
    router.push({ pathname: '/AddTransactions', params: { recipient: finalRecipient } });
  };
  
  const renderContact = ({ item }) => (
    <TouchableOpacity 
        style={styles.contactRow} 
        onPress={() => setSelectedContact(item.name)}
    >
        <View style={styles.contactInitialCircle}>
            <Text style={styles.contactInitialText}>{item.initials}</Text>
        </View>
        <Text style={styles.contactName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={homeStyles.container}>
      {menuVisible && (
        <View style={homeStyles.dropdownMenu}>
          <TouchableOpacity style={homeStyles.dropdownClose} onPress={() => setMenuVisible(false)}>
            <Text style={{ color: colors.text.white, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.dropdownLogout} onPress={logout}>
            <Text style={homeStyles.dropdownLogoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={homeStyles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={AvatarImg} style={homeStyles.avatar} />
          <Text style={homeStyles.headerText}>Olá, {user?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Text style={{ color: colors.text.black, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
          <TouchableOpacity onPress={() => router.replace('/tabs/Home')} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Para quem você quer transferir?</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome, CPF/CNPJ ou chave Pix"
            placeholderTextColor={colors.text.muted}
            value={selectedContact || recipient}
            onChangeText={text => {
                setRecipient(text);
                setSelectedContact(null);
            }}
          />
          <Text style={styles.subtitle}>Transferências recentes</Text>
          
          {loadingContacts ? (
            <ActivityIndicator style={{flex: 1}} size="large" color={colors.secondary} />
          ) : (
            <FlatList
              data={contacts}
              renderItem={renderContact}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum contato salvo ainda.</Text>}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: spacing.lg,
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 90,
    },
    closeButton: { alignSelf: 'flex-start', marginBottom: spacing.md, },
    closeButtonText: { fontSize: 24, color: colors.text.primary, },
    title: { fontSize: fontSize.xl, fontWeight: 'bold', marginBottom: spacing.lg, },
    subtitle: { fontSize: fontSize.md, color: colors.text.secondary, marginTop: spacing.xl, marginBottom: spacing.md, },
    input: { borderBottomWidth: 1, borderColor: colors.text.muted, paddingVertical: spacing.md, fontSize: fontSize.md, },
    contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, },
    contactInitialCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, },
    contactInitialText: { color: colors.secondary, fontWeight: 'bold', },
    contactName: { fontSize: fontSize.md, },
    footer: {
        paddingTop: spacing.lg,
        marginTop: 'auto',
    },
    button: {
        backgroundColor: colors.secondary,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.text.white,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
    emptyListText: {
        textAlign: 'center',
        color: colors.text.muted,
        marginTop: 20,
    }
});