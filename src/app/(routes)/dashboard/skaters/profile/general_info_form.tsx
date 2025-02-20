"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LocationSelector from "@/components/LocationSelector";
import { useRouter } from 'next/navigation';



export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    birthskate: "",
    ciudad: "",
    departamento: "",
    estado: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/skate_profiles/general_info?email=${session.user?.email}`);
        if (!response.ok) throw new Error("No se pudo obtener la información del perfil.");

        const data = await response.json();
        console.log("Datos recibidos:", data);

        setFormData({
          name: data.user?.name || "",
          phone: data.user?.phone || "",
          estado: data.user?.estado || "",
          departamento: data.user?.departamento || "",
          ciudad: data.user?.ciudad || "",
          birthdate: data.user?.birthdate ? data.user.birthdate.split("T")[0] : "",
          birthskate: data.user?.birthskate ? data.user.birthskate.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [status, session?.user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (field: "ciudad" | "departamento", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!isClient) return <p>Cargando...</p>; // Evita el render en SSR

  const handleSubmitUpdatePofile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user) {
      console.error('No estás autenticado');
      setLoading(false);
      return;
    }
    /* console.log("📦 Datos a enviar:", formData); */


    try {
      const response = await fetch('/api/skate_profiles/general_info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          phone: formData.phone,
          ciudad: formData.ciudad,
          departamento: formData.departamento,
          estado: formData.estado,
          birthdate: formData.birthdate,
          birthskate: formData.birthskate,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      console.log('Registro exitoso:', data);

      router.push('/dashboard/skaters/profile');
    } catch (error) {
      console.error('Error al registrar:', error);
    } finally {
      setLoading(false);
    }

  }


  return (
    <div className="text-black">
      <h1 className="mt-2 text-3xl">Hola</h1>
      <span className="text-xl">Información general</span>

      {loading && <p>Cargando...</p>}

      <form
        onSubmit={handleSubmitUpdatePofile}
        className="grid grid-cols-2 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
          <input className="shadow border rounded w-full py-2 px-3" type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono:</label>
          <input className="shadow border rounded w-full py-2 px-3" type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label htmlFor="birthdate" className="block text-gray-700 text-sm font-bold mb-2">Fecha de nacimiento:</label>
          <input className="shadow border rounded w-full py-2 px-3" type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label htmlFor="birthskate" className="block text-gray-700 text-sm font-bold mb-2">Fecha en que empezó a patinar:</label>
          <input className="shadow border rounded w-full py-2 px-3" type="date" id="birthskate" name="birthskate" value={formData.birthskate} onChange={handleChange} />
        </div>

        <div className="mb-4 col-span-2">
          <LocationSelector
            selectedDepartment={formData.departamento}
            setSelectedDepartment={(value) => handleLocationChange("departamento", value)}
            selectedCity={formData.ciudad}
            setSelectedCity={(value) => handleLocationChange("ciudad", value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
          <input className="shadow border rounded w-full py-2 px-3" type="text" id="estado" name="estado" value={formData.estado} onChange={handleChange} />
        </div>

        <div className="flex items-center justify-between col-span-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
