// app/(auth)/verify-email.tsx
import { View, Text } from 'react-native';
export default function VerifyEmail() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', gap:8, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'600', textAlign:'center' }}>
        가입이 완료되었습니다. 이메일의 인증 링크를 눌러 주세요.
      </Text>
      <Text>인증 완료 후 돌아오면 메인으로 이동합니다.</Text>
    </View>
  );
}
