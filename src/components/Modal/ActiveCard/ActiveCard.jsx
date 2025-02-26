import { Box, Divider, Grid, Modal, Stack, styled, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { singleFileValidator } from '~/utils/validators'
import CancelIcon from '@mui/icons-material/Cancel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import CardUserGroup from './CardUserGroup'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import DvrRoundedIcon from '@mui/icons-material/DvrRounded'
import CardActivitySection from './CardActivitySection'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { AddOutlined, AttachFileOutlined, AutoFixHighOutlined, ImageOutlined, LocalOfferOutlined, TaskAltOutlined, WatchLaterOutlined } from '@mui/icons-material'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { useDispatch, useSelector } from 'react-redux'
import { clearAndHideCurrentActiveCard, selectCurrentActiveCard, selectIsShowModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constant'
import { upperCase } from 'lodash'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alighItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#09caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#fff',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#09caf9' : '#e9f2ff'
    }
  }
}))
const ActiveCard = () => {
  const activeCard = useSelector(selectCurrentActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const dispatch = useDispatch()
  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)

    //B1: cap nhat lai card dang active
    dispatch(updateCurrentActiveCard(updatedCard))
    //B2: cap nhat lai cai bang ghi card trong activeBoard
    dispatch(updateCardInBoard(updatedCard))
    return updatedCard
  }
  const onUdpateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardOver', event.target?.files[0])

    //call api
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      { pending: 'Uploading...' }
    )
  }


  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  //Dung async await de cardActivitySection cho va neu thanh cong clear content
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }
  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>
        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt='card-cover'
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />
          {/* Feature 1 */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUdpateCardTitle}
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={9}>
            {/* Left side */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>
                Members
              </Typography>
              {/* Feature 2 */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alighItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Desctiption
                </Typography>
              </Box>

              {/* Feature 3 */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrRoundedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>

              {/* Feature  4 */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Feature  5 */}
          <Grid item xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>
              Add to card
            </Typography>
            <Stack direction="column" spacing={1}>
              {/* Neu user hien tai dang nhap chua thuoc memberIds cua card thi nut Join moi xuat hien */}
              {!activeCard?.memberIds?.includes(currentUser._id) ?
                <SidebarItem sx={{ bgcolor: 'primary.dark', display: 'flex', justifyContent: 'center' }} className='active' onClick={() => onUpdateCardMembers({
                  userId: currentUser._id,
                  action: CARD_MEMBER_ACTIONS.ADD
                })}>
                  <Typography sx={{ color: 'white' }}>{upperCase('j o i n')}</Typography>
                </SidebarItem>
                :
                <SidebarItem sx={{ bgcolor: '#ea6d6d', display: 'flex', justifyContent: 'center' }} className='active' onClick={() => onUpdateCardMembers({
                  userId: currentUser._id,
                  action: CARD_MEMBER_ACTIONS.REMOVE
                })}>
                  <Typography sx={{ color: 'white' }}>{upperCase('l e a v e')}</Typography>
                </SidebarItem>
              }

              <SidebarItem className='active' component='label'>
                <ImageOutlined fontSize='small' />Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem><AttachFileOutlined fontSize='small' /> Attachment </SidebarItem>
              <SidebarItem ><LocalOfferOutlined fontSize='small' /> Labels </SidebarItem>
              <SidebarItem ><TaskAltOutlined fontSize='small' /> Checklist </SidebarItem>
              <SidebarItem ><WatchLaterOutlined fontSize='small' /> Dates </SidebarItem>
              <SidebarItem ><AutoFixHighOutlined fontSize='small' /> Custom Fields </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>
              Power-Ups
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize='small' /> Card Size </SidebarItem>
              <SidebarItem ><AddToDriveOutlinedIcon fontSize='small' /> Google Drive </SidebarItem>
              <SidebarItem ><AddOutlined fontSize='small' /> Add Power-Ups </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>
              Actions
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize='small' /> Move </SidebarItem>
              <SidebarItem ><ContentCopyOutlinedIcon fontSize='small' /> Copy </SidebarItem>
              <SidebarItem ><AutoAwesomeOutlinedIcon fontSize='small' /> Make Template </SidebarItem>
              <SidebarItem ><ArchiveOutlinedIcon fontSize='small' /> Archive </SidebarItem>
              <SidebarItem ><ShareOutlinedIcon fontSize='small' /> Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
