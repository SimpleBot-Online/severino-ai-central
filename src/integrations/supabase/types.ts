export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calculos_mensais: {
        Row: {
          ano: number
          created_at: string | null
          data_calculo: string | null
          id: number
          mes: number
          total_aulas: number
          total_instrutores: number
          total_valor: number
          updated_at: string | null
        }
        Insert: {
          ano: number
          created_at?: string | null
          data_calculo?: string | null
          id?: number
          mes: number
          total_aulas: number
          total_instrutores: number
          total_valor: number
          updated_at?: string | null
        }
        Update: {
          ano?: number
          created_at?: string | null
          data_calculo?: string | null
          id?: number
          mes?: number
          total_aulas?: number
          total_instrutores?: number
          total_valor?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      detalhes_calculo: {
        Row: {
          aulas_extras: number
          aulas_normais: number
          calculo_id: number | null
          combustivel_gasto: number
          created_at: string | null
          desconto_faltas: number
          desconto_impostos: number
          faltas: number
          id: number
          instrutor_id: number | null
          updated_at: string | null
          valor_bruto: number
          valor_combustivel: number
          valor_liquido: number
        }
        Insert: {
          aulas_extras: number
          aulas_normais: number
          calculo_id?: number | null
          combustivel_gasto?: number
          created_at?: string | null
          desconto_faltas: number
          desconto_impostos: number
          faltas: number
          id?: number
          instrutor_id?: number | null
          updated_at?: string | null
          valor_bruto: number
          valor_combustivel: number
          valor_liquido: number
        }
        Update: {
          aulas_extras?: number
          aulas_normais?: number
          calculo_id?: number | null
          combustivel_gasto?: number
          created_at?: string | null
          desconto_faltas?: number
          desconto_impostos?: number
          faltas?: number
          id?: number
          instrutor_id?: number | null
          updated_at?: string | null
          valor_bruto?: number
          valor_combustivel?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "detalhes_calculo_calculo_id_fkey"
            columns: ["calculo_id"]
            isOneToOne: false
            referencedRelation: "calculos_mensais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalhes_calculo_instrutor_id_fkey"
            columns: ["instrutor_id"]
            isOneToOne: false
            referencedRelation: "instrutores"
            referencedColumns: ["id"]
          },
        ]
      }
      instrutores: {
        Row: {
          agencia: string | null
          banco: string | null
          conta: string | null
          cpf: string
          created_at: string | null
          id: number
          nome: string
          status: string | null
          tipo_conta: string | null
          updated_at: string | null
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          cpf: string
          created_at?: string | null
          id?: number
          nome: string
          status?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          cpf?: string
          created_at?: string | null
          id?: number
          nome?: string
          status?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      valores_referencia: {
        Row: {
          aula_extra: number
          aula_normal: number
          combustivel: number
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          falta: number
          id: number
          impostos: number
          salario_bruto: number
          updated_at: string | null
        }
        Insert: {
          aula_extra: number
          aula_normal: number
          combustivel: number
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          falta: number
          id?: number
          impostos: number
          salario_bruto: number
          updated_at?: string | null
        }
        Update: {
          aula_extra?: number
          aula_normal?: number
          combustivel?: number
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          falta?: number
          id?: number
          impostos?: number
          salario_bruto?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
