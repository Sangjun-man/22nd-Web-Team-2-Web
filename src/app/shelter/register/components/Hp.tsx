import Button from '@/components/common/Button/Button';
import EmphasizedTitle from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextFieldWithForm from '@/components/common/TextField/TextFieldWithForm';
import { H2 } from '@/components/common/Typography';
import { headerState } from '@/store/header';
import { useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { onNextProps } from '../page';

export default function Hp({ onNext }: onNextProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const setHeader = useSetRecoilState(headerState);
  useLayoutEffect(() => {
    setHeader(prev => ({
      ...prev,
      thisPage: 2,
      entirePage: 4
    }));
  }, [setHeader]);

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginTop: '40px',
          marginBottom: '160px'
        }}
      >
        <EmphasizedTitle>
          <H2>보호소 연락처를 입력해주세요.</H2>
        </EmphasizedTitle>
      </div>
      <TextFieldWithForm
        {...register('phoneNumber')}
        placeholder="연락처를 입력하세요 (-제외)"
        error={errors.phoneNumber}
      />

      <Button
        disabled={!!errors.phoneNumber}
        onClick={onNext}
        style={{ marginTop: '40px' }}
      >
        다음
      </Button>
    </div>
  );
}
