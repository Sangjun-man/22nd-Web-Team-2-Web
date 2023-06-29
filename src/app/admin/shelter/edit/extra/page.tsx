'use client';
import Button from '@/components/common/Button/Button';
import RadioGroup, {
  RadioOption
} from '@/components/common/RadioGroup/RadioGroup';
import TextField from '@/components/common/TextField/TextField';
import { Caption2 } from '@/components/common/Typography';
import { textButton } from '@/components/common/Typography/Typography.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as styles from './styles.css';
import FixedFooter from '@/components/common/FixedFooter/FixedFooter';
import TextArea from '@/components/common/TextField/TextArea';
import useShelterInfo from '@/api/shelter/admin/useShelterInfo';
import { isEmpty } from 'lodash';
import useUpdateAdditionalInfo from '@/api/shelter/admin/useUpdateAdditionalInfo';
import { useRouter } from 'next/navigation';
import { ShelterAdditionalInfoPayload } from '@/api/shelter/admin/additional-info';
import { useCallback, useMemo } from 'react';
import yup from '@/utils/yup';
import useHeader from '@/hooks/useHeader';
import { OutLink } from '@/types/shelter';

type FormValues = {
  instagram?: string;
  bankName?: string;
  accountNumber?: string;
  donationUrl?: string;
  isParkingEnabled?: string | null;
  parkingNotice?: string;
  notice?: string;
};
const parkingOptions: RadioOption[] = [
  {
    label: '가능',
    value: 'true'
  },
  {
    label: '불가능',
    value: 'false'
  }
];

const maxNoticeLength = 1000;
const maxParkingNoticeLength = 300;
const INSTAGRAM_BASE_URL = 'https://www.instagram.com/';
const schema: yup.ObjectSchema<FormValues> = yup
  .object()
  .shape({
    instagram: yup
      .string()
      .default('')
      .matches(/[\w\.]+$/i, {
        excludeEmptyString: true,
        message: '인스타그램 주소를 다시 확인해주세요'
      }),
    bankName: yup.string(),
    accountNumber: yup.string(),
    donationUrl: yup.string().url(),
    isParkingEnabled: yup.string(),
    parkingNotice: yup.string().max(maxParkingNoticeLength),
    notice: yup.string().max(maxNoticeLength)
  })
  .required();

export default function ShelterEditExtraPage() {
  useHeader({ title: '추가 정보' });
  const shelterQuery = useShelterInfo();
  const { mutateAsync: update } = useUpdateAdditionalInfo();
  const defaultValues = useMemo(() => {
    if (shelterQuery.isSuccess) {
      const data = shelterQuery.data;
      return {
        isParkingEnabled: data.parkingInfo?.isParkingEnabled.toString() || '',
        parkingNotice: data.parkingInfo?.parkingNotice || '',
        bankName: data.bankAccount?.bankName || '',
        accountNumber: data.bankAccount?.accountNumber || '',
        notice: data.notice || '',
        instagram:
          data.outLinks
            .find(link => link.outLinkType === 'INSTAGRAM')
            ?.url.replace(INSTAGRAM_BASE_URL, '') || '',
        donationUrl:
          data.outLinks.find(link => link.outLinkType === 'KAKAOPAY')?.url || ''
      };
    }
  }, [shelterQuery.data, shelterQuery.isSuccess]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues
  });
  const router = useRouter();

  const isParkingEnabled = watch('isParkingEnabled');
  const bankName = watch('bankName');
  const accountNumber = watch('accountNumber');

  const isAccountCompleted = Boolean(accountNumber) !== Boolean(bankName);
  const isNotError = isEmpty(errors);

  const isSubmittable = isAccountCompleted && isNotError;
  const accountNumberError = !!(isAccountCompleted && !accountNumber)
    ? {
        message: '계좌번호를 입력해주세요'
      }
    : undefined;
  const bankNameError = !!(isAccountCompleted && !bankName)
    ? {
        message: '은행명를 입력해주세요'
      }
    : undefined;

  const getPayload = useCallback((formValues: FormValues) => {
    const bankAccount =
      formValues.bankName && formValues.accountNumber
        ? {
            bankName: formValues.bankName,
            accountNumber: formValues.accountNumber
          }
        : null;
    const outLinks: OutLink[] = [];
    formValues.instagram &&
      outLinks.push({
        outLinkType: 'INSTAGRAM',
        url: INSTAGRAM_BASE_URL + formValues.instagram
      });
    formValues.donationUrl &&
      outLinks.push({ outLinkType: 'KAKAOPAY', url: formValues.donationUrl });

    const parkingInfo = formValues.isParkingEnabled
      ? {
          isParkingEnabled: formValues.isParkingEnabled === 'true',
          parkingNotice: formValues.parkingNotice || ''
        }
      : null;

    const payload: ShelterAdditionalInfoPayload = {
      notice: formValues.notice || null,
      bankAccount,
      outLinks,
      parkingInfo
    };

    return payload;
  }, []);

  const onSubmit = useCallback(
    (data: FormValues) => {
      console.log('🔸 → onSubmit → data:', data);

      const payload = getPayload(data);
      update({ payload }).then(() => router.back());
    },
    [getPayload, router, update]
  );

  return (
    <form className="page" onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <TextField
          label="인스타그램 계정"
          placeholder="프로필명"
          fixedValue={INSTAGRAM_BASE_URL}
          error={errors.instagram}
          {...register('instagram')}
        />
        <div>
          <TextField
            label="후원 계좌 정보"
            placeholder="은행명"
            error={errors.bankName || bankNameError}
            {...register('bankName')}
          />

          <TextField
            placeholder="계좌번호"
            error={errors.accountNumber || accountNumberError}
            disabled={!bankName}
            {...register('accountNumber')}
          />
          <TextField
            placeholder="카카오페이 코드 송금 링크 입력"
            error={errors.donationUrl}
            {...register('donationUrl')}
          />
          <Caption2 color="gray600">
            카카오페이 코드송금 링크를 입력하면, 원터치로 후원금 모금이
            가능해요.
          </Caption2>
          <br />
          <Caption2
            className={textButton}
            element={'a'}
            color="primary300"
            href=""
          >
            코드송금 링크는 어떻게 생성하나요?
          </Caption2>
        </div>
        <div>
          <RadioGroup
            style={{ marginBottom: '12px' }}
            label="주차 가능 여부"
            options={parkingOptions}
            {...register('isParkingEnabled')}
          />
          <TextField
            placeholder="추가 주차 관련 안내 (최대 200자)"
            disabled={!isParkingEnabled}
            error={errors.parkingNotice}
            {...register('parkingNotice')}
          />
        </div>
        <TextArea
          label="사전 안내 사항"
          placeholder="봉사자에게 사전에 안내해야 할 내용이 있다면 입력해주세요. (최대 1000자)"
          maxLength={maxNoticeLength}
          height="174px"
          error={errors.notice}
          {...register('notice')}
        />
      </div>
      <FixedFooter>
        <Button itemType="submit" disabled={isSubmittable}>
          저장하기
        </Button>
      </FixedFooter>
    </form>
  );
}
