// app/(auth)/signup-profile.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function SignUpProfile() {
  const { role, email, password } = useLocalSearchParams<{ role: string; email: string; password: string }>();
  const router = useRouter();
  const [username, setUsername] = useState('');
  return (
    <View style={{ padding:20, gap:8 }}>
      <TextInput placeholder="사용자 이름" value={username} onChangeText={setUsername}
        style={{ borderWidth:1, padding:12, borderRadius:8 }} />
      <Button title="회원가입" onPress={() => router.replace('/(auth)/verify-email')} />
    </View>
  );
}
