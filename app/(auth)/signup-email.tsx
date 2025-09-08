// app/(auth)/signup-email.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';

export default function SignUpEmail() {
  const { role } = useLocalSearchParams<{ role: string }>(); // :contentReference[oaicite:5]{index=5}
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return (
    <View style={{ padding:20, gap:8 }}>
      <Text>역할: {role}</Text>
      <TextInput placeholder="이메일" autoCapitalize="none" value={email} onChangeText={setEmail}
        style={{ borderWidth:1, padding:12, borderRadius:8 }} />
      <TextInput placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth:1, padding:12, borderRadius:8 }} />
      <Button title="다음"
        onPress={() => router.push({ pathname: '/(auth)/signup-profile', params: { role, email, password } })}
      />
    </View>
  );
}
