import moment from 'moment'
import { useState } from 'react'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/Link'
import { useRouter } from 'next/router'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { FaImage } from 'react-icons/fa'


export default function EditEventPage({ evt }) {
    console.log(evt)
    const [values, setValues] = useState({
        name: evt.data.attributes.name,
        performers: evt.data.attributes.performers,
        venue: evt.data.attributes.venue,
        address: evt.data.attributes.address,
        date: evt.data.attributes.date,
        time: evt.data.attributes.time,
        description: evt.data.attributes.description,
    })
    const [imagePreview, setImagePreview] = useState(
        evt.data.attributes.image.data
            ? evt.data.attributes.image.data.attributes.formats.thumbnail.url
            : null
    )
    const [showModal,setShowModal] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const hasEmptyFields = Object.values(values).some(
            (element) => element === ''
        )

        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }

        const res = await fetch(`${API_URL}/api/events/${evt.data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: values }),
        })
        if (!res.ok) {
            if (res.status === 403 || res.status === 401) {
                toast.error('No token included')
                return
            }
            toast.error('Something Went Wrong')
        } else {
            const evt = await res.json()
            router.push(`/events/${evt.data.attributes.slug}`)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }
    const imageUploaded = async (e) => {
         const res = await fetch(`${API_URL}/api/events/${evt.id}?populate=*`)
      const data = await res.json()
          setImagePreview(data.image.formats.thumbnail.url)
         setShowModal(false)
      }
    
    return (
        <Layout title="Add New Event">
            <Link href="/events">Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor="name">Event Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="performers">Performers</label>
                        <input
                            type="text"
                            name="performers"
                            id="performers"
                            value={values.performers}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="venue">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            id="venue"
                            value={values.venue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={values.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={moment(values.date).format('yyyy-MM-DD')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="time">Time</label>
                        <input
                            type="text"
                            name="time"
                            id="time"
                            value={values.time}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description">Event Description</label>
                    <textarea
                        type="text"
                        name="description"
                        id="description"
                        value={values.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <input type="submit" value="Update Event" className="btn" />
            </form>
            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} />
            ) : (
                <div>
                    <p>No Image Uploaded</p>
                </div>
            )}

            <div>
                <button className="btn-secondary" onClick={()=> setShowModal(true)}>
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={()=> setShowModal(false)}>
                <ImageUpload evtId={evt.data.id}  imageUploaded={imageUploaded}/>
            </Modal>
        </Layout>
    )
}

export async function getServerSideProps({ params: { id } }) {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
    const evt = await res.json()

    return {
        props: {
            evt,
        },
    }
}
