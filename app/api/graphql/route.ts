import serverClient from "@/lib/server/serverClient";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function POST(req: NextRequest) {
  const { query, variables } = await req.json();

  try {
    let result;
    if (query.trim().startsWith('mutation')) {
      result = await serverClient.mutate({
        mutation: gql`${query}`,
        variables,
      })
    } else {
      result = await serverClient.query({
        query: gql`${query}`,
        variables,
      })
    }

    const data = result.data;
    return NextResponse.json({ data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}